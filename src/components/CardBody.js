import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import "./CardBody.css";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CardHeader,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import isURL from "validator/lib/isURL";
import Box from "@mui/material/Box";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Spinner from "./Spinner";
import Switch from "@mui/material/Switch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CardBody.css";
import { Today } from "@mui/icons-material";

const CardBody = () => {
  const [linkError, setLinkError] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const userId = localStorage.getItem("user_id");
  const [tasks, setTasks] = useState([]);

  const [taskDueDate, setTaskDueDate] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState({
    id: null,
    task: "",
    description: "",
    link: "",
    is_completed: false,

    due_date: null,
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    task: "",
    description: "",
    link: "",
    user_id: userId,
    is_completed: false,
    due_date: null,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/task/${userId}`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [userId]);

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setNewTodo({
      task: "",
      description: " ",
      link: " ",
      user_id: userId,
      is_completed: false,
      due_date: null,
    });
  };
  const handleAddTodo = () => {
    if (newTodo.task.trim() === "") {
      setNewTodo({ ...newTodo, error: true });
      return;
    }

    if (newTodo.link === "" || isURL(newTodo.link)) {
      console.log(startDate);
      axios
        .post("http://localhost:8000/api/create", newTodo)
        .then(() => {
          axios
            .get(`http://localhost:8000/api/task/${userId}`)
            .then((response) => {
              setTasks(response.data);
              setIsLoading(false);
              toast("Successfully Added..!!");
            })
            .catch((error) => {
              console.error("Error fetching updated data:", error);
              setIsLoading(false);
              toast.error("Error!!", error);
            });
          handleCloseAddDialog();
        })
        .catch((error) => {
          console.error("Error adding todo:", error);
          setIsLoading(false);
          // toast.error("catch", error);
        });
    } else {
      setLinkError(true);
      return;
    }
  };

  const handleDelete = (id) => {
    setTaskToDeleteId(id);
    setDeleteDialogOpen(true);
    setSnackbarMessage("Deleted");
  };

  const handleUpdate = (task) => {
    console.log(task.due_date);
    console.log(setStartDate(task.due_date));

    setTaskToUpdate({
      id: task.id,
      task: task.task,
      description: task.description,
      link: task.link,
      is_completed: task.is_completed,
      due_date: task.due_date,
    });

    console.log("ch", taskDueDate);
    setTaskDueDate(taskToUpdate.due_date);
    setUpdateDialogOpen(true);

    const dateString = taskToUpdate.due_date;
    let dateObject = null;

    if (dateString && dateString.length === 8) {
      const year = parseInt(dateString.substr(0, 4), 10);
      const month = parseInt(dateString.substr(4, 2), 10) - 1;
      const day = parseInt(dateString.substr(6, 2), 10);

      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        dateObject = new Date(year, month, day);
      }
    }
    console.log(dateObject);
  };

  const handleToggleComplete = (task) => {
    const updatedTask = { ...task, is_completed: !task.is_completed };

    axios
      .put(`http://localhost:8000/api/update/${updatedTask.id}`, updatedTask)
      .then(() => {
        const updatedTasks = tasks.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        );
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        toast.error(
          "Error!! Plz Check Your Internet Connection(DB).. task:",
          error
        );
      });
  };

  const handleConfirmDelete = () => {
    if (taskToDeleteId) {
      axios
        .delete(`http://localhost:8000/api/delete/${taskToDeleteId}`)
        .then(() => {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== taskToDeleteId)
          );
          setFilteredTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== taskToDeleteId)
          );

          setTaskToDeleteId(null);
          setIsLoading(false);
          toast.error("Successfully Deleted..!!");
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
          toast.error("Error deleting task:", error);

          setIsLoading(false);
        });
    }
    setDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setTaskToDeleteId(null);
    setDeleteDialogOpen(false);
  };

  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
  };
  const handleUpdateTask = () => {
    axios
      .put(`http://localhost:8000/api/update/${taskToUpdate.id}`, taskToUpdate)
      .then(() => {
        setUpdateDialogOpen(false);
        axios
          .get(`http://localhost:8000/api/task/${userId}`)
          .then((response) => {
            setTasks(response.data);
            toast.success("Task Updated successfully", { autoClose: 3000 });
            setFilteredTasks(response.data);
          })
          .catch((error) => {
            console.error("Error fetching updated data:", error);
            toast.error(
              "Error!! Plz Check Your Internet Connection(DB).. task:",
              error
            );

            setIsLoading(false);
          });
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error updating task:", error);
      });
  };

  const handleFilterReset = () => {
    setSearchId("");
    setShowCompletedTasks(false);
    setTaskDueDate(null);
    handleSearch();
  };

  const handleSearch = () => {
    const filtered = tasks.filter(
      (task) =>
        task.task.toLowerCase().includes(searchId.toLowerCase()) &&
        (!showCompletedTasks || !task.is_completed) &&
        (!taskDueDate || task.due_date === taskDueDate)
    );

    setFilteredTasks(filtered);
    setIsLoading(false);
  };

  useEffect(() => {
    handleSearch();
  });

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showCompletedTasks}
                  onChange={() => setShowCompletedTasks(!showCompletedTasks)}
                  name="showCompletedTasks"
                  color="primary"
                />
              }
              label="Show Uncompleted"
              sx={{
                marginTop: 2,
                marginLeft: "10px",
              }}
            />
            <Button
              variant="contained"
              sx={{
                mt: 1,
              }}
              style={{
                backgroundColor: "#C1A4EB",
                color: "#ffffff",
                marginRight: "10px",
              }}
              startIcon={<CalendarTodayIcon />}
            >
              <input
                type="date"
                value={taskDueDate || ""}
                onChange={(e) => setTaskDueDate(e.target.value)}
                style={{
                  backgroundColor: "#C1A4EB",
                  color: "#ffffff",
                  border: "none",
                  marginRight: "10px",
                }}
              />
            </Button>

            <Button
              variant="contained"
              sx={{
                mt: 1,
              }}
              style={{
                backgroundColor: "#C1A4EB",
                color: "#ffffff",
                marginRight: "10px",
              }}
              onClick={handleFilterReset}
            >
              Reset Filters
            </Button>

            <Button
              variant="contained"
              sx={{
                mt: 1,
              }}
              style={{ backgroundColor: "#9150F0", color: "#ffffff" }}
              onClick={handleOpenAddDialog}
              startIcon={<AddIcon />}
            >
              Add Todo
            </Button>
          </div>

          <div>
            <Box      
            >
              {/* <TextField
                placeholder="   Enter task name..."
                variant="standard"
                fullWidth={true.toString()}
                value={searchId || ""}
                className="searchBox"
                onChange={(e) => setSearchId(e.target.value)}
                InputProps={{
                  style: {
                    borderBottom: '3px solid #9150F0',
                    justifyContent: 'center',
                    top: '-124.9px',
                    width: '23%',
                    left: '40.5%',
                    borderRadius: '5px',
                  },
                  
                }}

                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mt: 2.5 }}
              /> */}

              <TextField
                placeholder="Enter task name..."
                variant="standard"
                fullWidth
                value={searchId || ""}
                className="searchBox"
                onChange={(e) => setSearchId(e.target.value)}
                InputProps={{
                  sx: {
                    display: {
                      xs: "block",
                      md: "none",
                      lg: "none",

                    },
                    borderBottom: "3px solid #9150F0",
                    justifyContent: "center",
                    top: "-127.9px",
                    width: "60%",
                    left: "27.5%",
                    // borderRadius: "5px",
                    md: {
                      borderBottom: "3px solid #9150F0",
                      justifyContent: "center",
                      top: "-124.9px",
                      width: "80%",
                      left: "10.5%",
                      borderRadius: "5px",
                    },
                    xs: {
                      borderBottom: "3px solid #9150F0",
                      justifyContent: "center",
                      top: "-124.9px",
                      width: "23%",
                      left: "40.5%",
                      borderRadius: "5px",
                    },
                  },
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mt: 2.5 }}
              />
                <TextField
                placeholder="Enter task name..."
                variant="standard"
                fullWidth
                value={searchId || ""}
                className="searchBox"
                onChange={(e) => setSearchId(e.target.value)}
                InputProps={{
                  sx: {
                    display: {
                      xs: "none",
                      md: "block",
                      lg: "block",

                    },
                    borderBottom: "3px solid #9150F0",
                    justifyContent: "center",
                    top: "-140.9px",
                    width: "25%",
                    left: "70.5%",
                    borderRadius: "5px",
  
                  },
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mt: 2.5 }}
              />
            </Box>
          </div>
          <div>
            {filteredTasks.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="img-style"
              >
                <img
                  src="./images/no.svg"
                  style={{ width: "30%", height: "25%" }}
                  alt="No Task Found"
                  className="img-style"
                />
              </div>
            ) : (
              <Grid
                container
                spacing={2}
                sx={{ mt: 1 }}
                style={{ justifyContent: "center" }}
              >
                {filteredTasks.map((task) => (
                  <Grid item xs={8} md={4} lg={2} key={task.id}>
                    <Card style={{ minHeight: "98%", marginBottom: "10px" }}>
                      <CardHeader
                        title={task.task}
                        style={{
                          borderBottom: "2px solid #c1a4eb",
                          fontFamily: "ui-serif",
                        }}
                      />
                      <CardContent sx={{ position: "relative" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={Boolean(task.is_completed)}
                                onChange={() => handleToggleComplete(task)}
                                name="isCompleted"
                                className={
                                  Boolean(task.is_completed)
                                    ? "checked-checkbox"
                                    : "unchecked-checkbox"
                                }
                              />
                            }
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              position: "absolute",
                              top: "-55px",
                              right: "0px",
                            }}
                          />
                        </div>
                        <Typography variant="body2" color="text.secondary">
                          {task.description}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ position: "relative", top: "39px" }}
                        >
                          <a
                            href={"http://" + task.link}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {task.link}
                          </a>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ position: "absolute", top: "97px" }}
                        >
                          {task.due_date}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "flex-end" }}>
                        <IconButton
                          onClick={() => handleUpdate(task)}
                          color="#9150F0"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(task.id)}
                          color="#9150F0"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              theme="dark"
            />
          </div>

          <Dialog
            open={deleteDialogOpen}
            onClose={handleCancelDelete}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this task?
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCancelDelete}
                style={{ backgroundColor: "#9150F0", color: "white" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                style={{ backgroundColor: "#9150F0", color: "white" }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={updateDialogOpen}
            onClose={handleUpdateDialogClose}
            aria-labelledby="update-dialog-title"
            aria-describedby="update-dialog-description"
          >
            <DialogTitle id="update-dialog-title">Edit Task</DialogTitle>
            <DialogContent>
              <TextField
                sx={{ mt: 1 }}
                label="Task"
                variant="outlined"
                fullWidth={true.toString()}
                value={taskToUpdate.task}
                onChange={(e) =>
                  setTaskToUpdate({ ...taskToUpdate, task: e.target.value })
                }
              />
              <TextField
                sx={{ mt: 1 }}
                label="Description"
                variant="outlined"
                fullWidth={true.toString()}
                value={taskToUpdate.description}
                onChange={(e) =>
                  setTaskToUpdate({
                    ...taskToUpdate,
                    description: e.target.value,
                  })
                }
              />
              <TextField
                sx={{ mt: 1 }}
                label="Link"
                variant="outlined"
                fullWidth={true.toString()}
                value={taskToUpdate.link}
                onChange={(e) =>
                  setTaskToUpdate({ ...taskToUpdate, link: e.target.value })
                }
              />

              <div style={{ marginTop: "15px" }}>
                <input
                  type="date"
                  value={taskToUpdate.due_date || ""}
                  selected={Today}
                  onChange={(e) =>
                    setTaskToUpdate({
                      ...taskToUpdate,
                      due_date: e.target.value,
                    })
                  }
                  style={{ height: "40px", width: "100%", opacity: "0.4" }}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleUpdateDialogClose}
                style={{ backgroundColor: "#9150F0", color: "white" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateTask}
                style={{ backgroundColor: "#9150F0", color: "white" }}
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>

          <div style={{ justifyContent: "center" }}>
            <Dialog
              open={addDialogOpen}
              onClose={handleCloseAddDialog}
              aria-labelledby="add-dialog-title"
              aria-describedby="add-dialog-description"
              sx={{
                minWidth: "500px",
                minHeight: "500px",
                maxWidth: "500px",
                maxHeight: "500px",
                left: "35%",
                top: "23%",
              }}
            >
              <DialogTitle id="add-dialog-title">Add Todo</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth={true.toString()}
                  label="Task"
                  variant="outlined"
                  value={newTodo.task || ""}
                  onChange={(e) =>
                    setNewTodo({
                      ...newTodo,
                      task: e.target.value,
                      error: false,
                    })
                  }
                  error={newTodo.error}
                  sx={{ mt: 2 }}
                  InputProps={{
                    style: {
                      borderBottom: newTodo.error
                        ? "1px solid red"
                        : "1px solid #000",
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {newTodo.error && (
                  <Typography color="error" sx={{ fontSize: "10px" }}>
                    We require the task field.
                  </Typography>
                )}
                <TextField
                  fullWidth={true.toString()}
                  label="Description"
                  variant="outlined"
                  value={newTodo.description}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, description: e.target.value })
                  }
                  sx={{ mt: 1 }}
                />
                <TextField
                  fullWidth={true.toString()}
                  label="Link"
                  variant="outlined"
                  value={newTodo.link}
                  onChange={(e) => {
                    setNewTodo({ ...newTodo, link: e.target.value });
                    setLinkError(false);
                  }}
                  sx={{ mt: 1 }}
                  error={linkError}
                />
                {linkError && (
                  <Typography color="error" sx={{ fontSize: "10px" }}>
                    Enter a valid link (URL).
                  </Typography>
                )}

                <div
                  style={{
                    marginTop: "15px",
                    height: "44px",
                    width: "387px",
                    opacity: "1",
                    borderRadius: "5px",
                  }}
                >
                  <span className="corner-span"></span>

                  <input
                    fullWidth={true.toString()}
                    type="date"
                    value={newTodo.due_date || ""}
                    selected={newTodo.due_date}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, due_date: e.target.value })
                    }
                    style={{ height: "40px", width: "100%", opacity: "0.4" }}
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseAddDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleAddTodo} color="primary">
                  Add
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity="error">
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      )}
    </div>
  );
};

export default CardBody;
