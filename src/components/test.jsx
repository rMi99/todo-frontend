import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import {
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
  DialogContentText,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Spinner from './Spinner';

const TaskTable = () => {
  const userId = localStorage.getItem('user_id');
  const [tasks, setTasks] = useState([]);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState({
    id: null,
    task: '',
    description: '',
    is_completed: false,
    created_at: '',
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    task: '',
    description: '',
    user_id: userId,
    is_completed: false,
  });
  const [searchId, setSearchId] = useState('');
  const [searchedTask, setSearchedTask] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:8000/api/task/${userId}`)
      .then((response) => {
        setTasks(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, [userId]);

//   const handleOpenAddDialog = () => {
//     setAddDialogOpen(true);
//   };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setNewTodo({
      task: '',
      description: '',
      user_id: userId,
      is_completed: false,
    });
  };

  const handleAddTodo = () => {
    setIsLoading(true);

    if (newTodo.task.trim() === '') {
      setIsLoading(false);
    //   setSnackbarMessage('Task cannot be null.');
    //   setSnackbarOpen(true);
      return;
    }

    axios
      .post('http://localhost:8000/api/create', newTodo)
      .then(() => {
        axios
          .get(`http://localhost:8000/api/task/${userId}`)
          .then((response) => {
            setTasks(response.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching updated data:', error);
            setIsLoading(false);
          });
        handleCloseAddDialog();
      })
      .catch((error) => {
        console.error('Error adding todo:', error);
        setIsLoading(false);
      });
  };

  const handleDelete = (id) => {
    setTaskToDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleUpdate = (task) => {
    setTaskToUpdate({
      id: task.id,
      task: task.task,
      description: task.description,
      is_completed: task.is_completed,
      created_at: task.created_at,
    });
    setUpdateDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsLoading(true);

    if (taskToDeleteId) {
      axios
        .delete(`http://localhost:8000/api/delete/${taskToDeleteId}`)
        .then(() => {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== taskToDeleteId)
          );
          setDeleteSuccess(true);
          setTaskToDeleteId(null);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error deleting task:', error);
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

  const handleToggleComplete = (id, isCompleted) => {
    setIsLoading(true);
  
    axios
      .put(`http://localhost:8000/api/update/${id}`, {
        is_completed: !isCompleted,
      })
      .then(() => {
        axios
          .get(`http://localhost:8000/api/task/${userId}`)
          .then((response) => {
            setTasks(response.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching updated data:', error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error updating task:', error);
      });
  };
  
  const handleUpdateTask = () => {
    setIsLoading(true);

    axios
      .put(`http://localhost:8000/api/update/${taskToUpdate.id}`, taskToUpdate)
      .then(() => {
        setUpdateDialogOpen(false);

        axios
          .get(`http://localhost:8000/api/task/${userId}`)
          .then((response) => {
            setTasks(response.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching updated data:', error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error updating task:', error);
      });
  };

  const handleDeleteAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setDeleteSuccess(false);
  };

  const handleSearch = () => {
    setIsLoading(true);

    axios
      .get(`http://localhost:8000/api/show/${searchId}/${userId}`)
      .then((response) => {
        setSearchedTask(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching task by ID:', error);
        setSearchedTask(null);
        setIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No Task Found!!',
        });
      });
  };

  return (
    <div>
      {/* Task list */}
      {isLoading ? (
        <Spinner />
      ) : (
        tasks.map((task) => (
          <Card key={task.id}>
            <CardContent>
              <Typography variant="h6">{task.task}</Typography>
              <Typography variant="body2">{task.description}</Typography>
              <Typography variant="caption">
                Created at: {task.created_at}
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={task.is_completed}
                    onChange={() =>
                      handleToggleComplete(task.id, task.is_completed)
                    }
                    name="isCompleted"
                    color="primary"
                  />
                }
                label="Completed"
              />
            </CardContent>
            <CardActions>
              <IconButton
                onClick={() => handleDelete(task.id)}
                color="error"
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={() => handleUpdate(task)}
                color="primary"
                aria-label="edit"
              >
                <EditIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))
      )}

      {/* Add Task Dialog */}
      <Dialog open={addDialogOpen} onClose={handleCloseAddDialog}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task"
            value={newTodo.task}
            onChange={(e) =>
              setNewTodo({ ...newTodo, task: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Description"
            value={newTodo.description}
            onChange={(e) =>
              setNewTodo({ ...newTodo, description: e.target.value })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddTodo} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Task Dialog */}
      <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task"
            value={taskToUpdate.task}
            onChange={(e) =>
              setTaskToUpdate({ ...taskToUpdate, task: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Description"
            value={taskToUpdate.description}
            onChange={(e) =>
              setTaskToUpdate({
                ...taskToUpdate,
                description: e.target.value,
              })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateDialogClose}>Cancel</Button>
          <Button onClick={handleUpdateTask} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Task Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Success Message */}
      <Snackbar
        open={deleteSuccess}
        autoHideDuration={3000}
        onClose={handleDeleteAlertClose}
      >
        <Alert onClose={handleDeleteAlertClose} severity="success">
          Task deleted successfully!
        </Alert>
      </Snackbar>

      {/* Search Task */}
      <TextField
        label="Search by ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        fullWidth
      />
      <Button onClick={handleSearch} variant="contained" color="primary">
        Search
      </Button>

      {/* Display Searched Task */}
      {searchedTask && (
        <Card>
          <CardContent>
            <Typography variant="h6">{searchedTask.task}</Typography>
            <Typography variant="body2">{searchedTask.description}</Typography>
            <Typography variant="caption">
              Created at: {searchedTask.created_at}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={searchedTask.is_completed}
                  name="isCompleted"
                  color="primary"
                  disabled
                />
              }
              label="Completed"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskTable;
