// import logo from './logo.svg';
import "./App.css";
import { Container } from "@mui/material";
import { Grid, Typography, Card, CardContent, Slider } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import { TiPlus } from "react-icons/ti";
import { useState, forwardRef, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import { linearProgressClasses } from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));
const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const App = () => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setDescription("");
    setCategory("");
    setOpen(false);
  };
  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };
  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTaskLoad(true);
    function getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    // console.log(description);
    // console.log(category);
    let task;
    if (allCategoryColor) {
      var result = allCategoryColor.find((obj) => {
        return obj.category === category;
      });
      if (result) {
        task = {
          category: {
            name: category,
            color: result.color,
          },
          description: description,
        };
        fetch(`https://todo-3f773-default-rtdb.firebaseio.com/task.json`, {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            setRefresh(!refresh);
          });
      } else {
        task = {
          category: {
            name: category,
            color: getRandomColor(),
          },
          description: description,
        };
        // cat = {
        //   name: category,
        //   color: colorr,
        // };
        // console.log(cat);
        // console.log(task);
        fetch(`https://todo-3f773-default-rtdb.firebaseio.com/task.json`, {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            setRefresh(!refresh);
          });
      }
    } else {
      task = {
        category: {
          name: category,
          color: getRandomColor(),
        },
        description: description,
      };
      fetch(`https://todo-3f773-default-rtdb.firebaseio.com/task.json`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setRefresh(!refresh);
        });
    }

    handleClose();
  };

  const [task, setTask] = useState();
  const [refresh, setRefresh] = useState(true);
  const [categoryList, setCategoryList] = useState();
  const [allCategories, setAllCategories] = useState();
  const [allCategoryColor, setAllCategoryColor] = useState();
  useEffect(() => {
    fetch(`https://todo-3f773-default-rtdb.firebaseio.com/task.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!data) {
          setTask(false);
          setTaskLoad(false);
          setLoading(false);
        } else {
          let tk = [];
          for (const key in data) {
            tk.push({
              id: key,
              task: data[key].description,
              categoryName: data[key].category.name,
              categoryColor: data[key].category.color,
            });
          }
          setTask(tk);
          let allCat = [];
          let allCatColor = [];
          for (const key in tk) {
            allCatColor.push({
              category: tk[key].categoryName,
              color: tk[key].categoryColor,
            });
          }
          setAllCategoryColor(allCatColor);
          for (const key in tk) {
            allCat.push(tk[key].categoryName);
          }
          setCategoryList([...new Set(allCat)]);
          const count = {};

          for (const element of allCat) {
            if (count[element]) {
              count[element] += 1;
            } else {
              count[element] = 1;
            }
          }

          setAllCategories(count);
          setShowCategories(true);
          setTaskLoad(false);
          setLoading(false);
          // const uniqueCategory = [
          //   ...new Set(tk.map((item) => item.categoryName)),
          // ];
          // console.log(uniqueCategory);
        }
      });
  }, [refresh]);
  const deleteTaskHandler = (tuk) => {
    setTaskLoad(true);
    if (task.length > 1) {
      fetch(
        `https://todo-3f773-default-rtdb.firebaseio.com/task/${tuk.id}.json`,
        {
          method: "DELETE", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setRefresh(!refresh);
        });
    } else {
      fetch(`https://todo-3f773-default-rtdb.firebaseio.com/task.json`, {
        method: "PUT", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(false),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setRefresh(!refresh);
        });
    }
  };

  const [taskLoad, setTaskLoad] = useState(false);

  const selectColor = (category) => {
    let res = allCategoryColor.find((obj) => {
      return obj.category === category;
    });
    return res.color;
  };
  return (
    <>
      <Grid container>
        {loading ? (
          <Container
            maxWidth="lg"
            style={{ paddingTop: "50vh", textAlign: "center" }}
          >
            <CircularProgress />
          </Container>
        ) : (
          <>
            <Container maxWidth="lg">
              <Grid container spacing={2} style={{ textAlign: "left" }}>
                <Grid item xs={12}>
                  <Typography
                    variant="h3"
                    gutterBottom
                    component="div"
                    style={{
                      fontFamily: "Titillium Web",
                      fontWeight: 600,
                      color: "black",
                      paddingTop: 20,
                    }}
                  >
                    What's up, User
                  </Typography>
                </Grid>
              </Grid>
              {taskLoad ? (
                <Grid item xs={12} style={{ textAlign: "center" }}>
                  <CircularProgress />
                </Grid>
              ) : (
                <>
                  {task ? (
                    <>
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            component="div"
                            style={{
                              textAlign: "left",
                              fontFamily: "Titillium Web",
                              fontWeight: 600,
                              color: "#9BA3CC",
                              paddingTop: 20,
                              fontSize: 15,
                            }}
                          >
                            CATEGORIES
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ paddingTop: 20 }}>
                        {Object.keys(allCategories).map((key, index) => (
                          <Grid item xs={12} md={3} sm={6} key={index}>
                            <Card sx={{ borderRadius: 8 }}>
                              <CardContent
                                style={{ backgroundColor: "#000C49" }}
                              >
                                <Typography
                                  style={{
                                    textAlign: "left",
                                    backgroundColor: "#000C49",
                                    color: "#9BA3CC",
                                    fontFamily: "Titillium Web",
                                    fontWeight: 300,
                                  }}
                                  sx={{ fontSize: 14 }}
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  {allCategories[key]}{" "}
                                  {allCategories[key] > 1 ? "tasks" : "task"}
                                </Typography>
                                <Typography
                                  style={{
                                    textAlign: "left",
                                    backgroundColor: "#000C49",
                                    fontFamily: "Titillium Web",
                                    fontWeight: 600,
                                    fontSize: 25,
                                  }}
                                  sx={{ fontSize: 14 }}
                                  gutterBottom
                                  color={() => selectColor(key)}
                                >
                                  {key}
                                </Typography>
                                <BorderLinearProgress
                                  variant="determinate"
                                  value={allCategories[key]}
                                />
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                      <Grid
                        container
                        spacing={2}
                        style={{ paddingTop: 40, paddingBottom: 20 }}
                      >
                        <Grid item xs={12}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            component="div"
                            style={{
                              textAlign: "left",
                              fontFamily: "Titillium Web",
                              fontWeight: 600,
                              color: "#9BA3CC",
                              paddingTop: 20,
                              fontSize: 15,
                            }}
                          >
                            PENDING TASK
                          </Typography>
                        </Grid>
                        {task.map((tak, index) => (
                          <Grid item xs={12} key={index}>
                            <Card
                              sx={{
                                borderRadius: 8,
                                backgroundColor: "#000C49",
                              }}
                            >
                              <CardContent>
                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        style={{
                                          color: tak.categoryColor,
                                          fontSize: 100,
                                          pointerEvents: "auto",
                                        }}
                                        onClick={() => deleteTaskHandler(tak)}
                                      />
                                    }
                                    label={
                                      <Typography
                                        style={{
                                          color: "#white",
                                          fontFamily: "Titillium Web",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {tak.task}
                                      </Typography>
                                    }
                                    style={{
                                      color: "white",
                                      pointerEvents: "none",
                                    }}
                                  />
                                </FormGroup>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        style={{
                          textAlign: "left",
                        }}
                      >
                        <Fab
                          color="primary"
                          aria-label="add"
                          onClick={handleClickOpen}
                        >
                          <TiPlus />
                        </Fab>
                        <Dialog
                          open={open}
                          TransitionComponent={Transition}
                          keepMounted
                          onClose={handleClose}
                          aria-describedby="alert-dialog-slide-description"
                        >
                          <DialogTitle>{"Add task"}</DialogTitle>
                          <DialogContent>
                            <Container maxWidth="lg">
                              <Grid container>
                                <form
                                  autoComplete="off"
                                  onSubmit={handleSubmit}
                                >
                                  <Grid item xs={12}>
                                    <FormControl fullWidth>
                                      <TextField
                                        id="outlined-basic"
                                        value={description}
                                        label="Description"
                                        variant="outlined"
                                        margin="dense"
                                        required
                                        onChange={handleChangeDescription}
                                      />
                                    </FormControl>
                                  </Grid>

                                  {showCategories ? (
                                    <Grid
                                      item
                                      xs={12}
                                      style={{ paddingTop: 10 }}
                                    >
                                      <FormControl fullWidth>
                                        <InputLabel
                                          id="demo-simple-select-label"
                                          margin="dense"
                                        >
                                          Category
                                        </InputLabel>
                                        <Select
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          value={category}
                                          label="Category"
                                          onChange={handleChangeCategory}
                                          required
                                        >
                                          {categoryList.map((key, index) => (
                                            <MenuItem value={key} key={index}>
                                              {key}
                                            </MenuItem>
                                          ))}
                                          {/* <MenuItem value={20}>Twenty</MenuItem>
                                          <MenuItem value={30}>Thirty</MenuItem> */}
                                        </Select>
                                      </FormControl>
                                    </Grid>
                                  ) : (
                                    <Grid item xs={12}>
                                      <FormControl fullWidth>
                                        <TextField
                                          value={category}
                                          id="outlined-basic"
                                          label="Category"
                                          variant="outlined"
                                          margin="dense"
                                          required
                                          onChange={handleChangeCategory}
                                        />
                                      </FormControl>
                                    </Grid>
                                  )}
                                  {showCategories ? (
                                    <Grid
                                      item
                                      xs={12}
                                      style={{ paddingTop: 10 }}
                                    >
                                      <FormControl fullWidth>
                                        <Button
                                          variant="outlined"
                                          type="button"
                                          onClick={() => {
                                            setShowCategories(false);
                                          }}
                                        >
                                          Add category
                                        </Button>
                                      </FormControl>
                                    </Grid>
                                  ) : (
                                    <>
                                      <Grid
                                        item
                                        xs={12}
                                        style={{ paddingTop: 10 }}
                                      >
                                        <FormControl fullWidth>
                                          <Button
                                            variant="outlined"
                                            type="button"
                                            onClick={() => {
                                              setShowCategories(true);
                                              setCategory("");
                                            }}
                                          >
                                            Show categories
                                          </Button>
                                        </FormControl>
                                      </Grid>
                                    </>
                                  )}
                                  <Grid item xs={12} style={{ paddingTop: 10 }}>
                                    <FormControl fullWidth>
                                      <Button variant="contained" type="submit">
                                        Submit
                                      </Button>
                                    </FormControl>
                                  </Grid>
                                </form>
                              </Grid>
                            </Container>
                          </DialogContent>
                        </Dialog>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid container>
                        <Grid
                          item
                          xs={12}
                          style={{
                            textAlign: "left",
                          }}
                        >
                          <Fab
                            color="primary"
                            aria-label="add"
                            onClick={handleClickOpen}
                          >
                            <TiPlus />
                          </Fab>
                          <Dialog
                            open={open}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={handleClose}
                            aria-describedby="alert-dialog-slide-description"
                          >
                            <DialogTitle>{"Add task"}</DialogTitle>
                            <DialogContent>
                              <Container maxWidth="lg">
                                <Grid container>
                                  <form
                                    autoComplete="off"
                                    onSubmit={handleSubmit}
                                  >
                                    <Grid item xs={12}>
                                      <FormControl fullWidth>
                                        <TextField
                                          id="outlined-basic"
                                          label="Description"
                                          variant="outlined"
                                          margin="dense"
                                          required
                                          value={description}
                                          onChange={handleChangeDescription}
                                        />
                                      </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <FormControl fullWidth>
                                        <TextField
                                          value={category}
                                          id="outlined-basic"
                                          label="Category"
                                          variant="outlined"
                                          margin="dense"
                                          required
                                          onChange={handleChangeCategory}
                                        />
                                      </FormControl>
                                    </Grid>

                                    {/* {showCategories ? (
                                      <Grid
                                        item
                                        xs={12}
                                        style={{ paddingTop: 10 }}
                                      >
                                        <FormControl fullWidth>
                                          <InputLabel
                                            id="demo-simple-select-label"
                                            margin="dense"
                                          >
                                            Category
                                          </InputLabel>
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={category}
                                            label="Category"
                                            onChange={handleChangeCategory}
                                            required
                                          >
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>
                                              Twenty
                                            </MenuItem>
                                            <MenuItem value={30}>
                                              Thirty
                                            </MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                    ) : (
                                      <Grid item xs={12}>
                                        <FormControl fullWidth>
                                          <TextField
                                            value={category}
                                            id="outlined-basic"
                                            label="Category"
                                            variant="outlined"
                                            margin="dense"
                                            required
                                            onChange={handleChangeCategory}
                                          />
                                        </FormControl>
                                      </Grid>
                                    )} */}

                                    <Grid
                                      item
                                      xs={12}
                                      style={{ paddingTop: 10 }}
                                    >
                                      <FormControl fullWidth>
                                        <Button
                                          variant="contained"
                                          type="submit"
                                        >
                                          Submit
                                        </Button>
                                      </FormControl>
                                    </Grid>
                                  </form>
                                </Grid>
                              </Container>
                            </DialogContent>
                          </Dialog>
                        </Grid>
                        <Grid item xs={12} container justifyContent="center">
                          <img
                            src="task.png"
                            width="100%"
                            style={{ opacity: "0.7" }}
                          />
                        </Grid>
                        <Grid item xs={12} container justifyContent="center">
                          <Typography
                            variant="h6"
                            gutterBottom
                            component="div"
                            style={{
                              fontFamily: "Titillium Web",
                              fontWeight: 600,
                              color: "#9BA3CC",
                              paddingTop: 20,
                              fontSize: 15,
                            }}
                          >
                            No pending task !
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </>
              )}
            </Container>
          </>
        )}
      </Grid>
    </>
  );
};

export default App;
