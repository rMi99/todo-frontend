import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
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
  DialogContentText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Spinner from './Spinner'; 
import Avatar from '@mui/material/Avatar';

const TaskTable = () => {
  const userId = (localStorage.getItem('user_id'));
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
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    task: '',
    description: '',
    user_id: userId,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');  
  const [searchId, setSearchId] = useState('');
  // const [searchedTask, setSearchedTask] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:8000/api/task/${userId}`)
      .then((response) => {
        setTasks(response.data);
        setFilteredTasks(response.data); // Initialize filteredTasks with all tasks
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, [userId]);

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setNewTodo({
      task: '',
      description: '',
      user_id: userId,
    });
  };

  const handleAddTodo = () => {
    setIsLoading(true);

    if (newTodo.task.trim() === '') {
      setIsLoading(false);
      setSnackbarMessage('Task cannot be null.'); 
      setSnackbarOpen(true);
      return;
    }
  
    axios
      .post('http://localhost:8000/api/create', newTodo)
      .then(() => {
        axios
          .get(`http://localhost:8000/api/task/${userId}`)
          .then((response) => {
            setTasks(response.data);
            setFilteredTasks(response.data); 
            setIsLoading(false);
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Task added successfully',
              showConfirmButton: false,
              timer: 2000, 
            });
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
    });
    setUpdateDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsLoading(true);

    if (taskToDeleteId) {
      axios
        .delete(`http://localhost:8000/api/delete/${taskToDeleteId}`)
        .then(() => {
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDeleteId));
          setFilteredTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDeleteId));
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
            setFilteredTasks(response.data); // Update filteredTasks after updating a task
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


    const filtered = tasks.filter((task) =>
      task.task.toLowerCase().includes(searchId.toLowerCase())
    );

    setFilteredTasks(filtered);

    setIsLoading(false);
  };

  useEffect(() => {
    handleSearch();
  }, [searchId]);

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          <Button variant="outlined" color="success" sx={{ mt: 1 }} onClick={handleOpenAddDialog}>
            Add Todo
          </Button>

          <TextField
            label="Search by Task Name"
            variant="outlined"
            fullWidth
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {filteredTasks.map((task) => (
              <Grid item xs={8} md={4} lg={2} key={task.id}>
                <Card>
                  <CardContent>
                    <Avatar alt="avatar" src="https://mui.com/static/images/avatar/1.jpg" />
                    <Typography variant="h5" component="div">
                      {task.task}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {task.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handleUpdate(task)} color="success">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(task.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Snackbar open={deleteSuccess} autoHideDuration={3000} onClose={handleDeleteAlertClose}>
            <Alert onClose={handleDeleteAlertClose} severity="success">
              Task deleted successfully!
            </Alert>
          </Snackbar>

          <Dialog
            open={deleteDialogOpen}
            onClose={handleCancelDelete}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
            <DialogContent>Are you sure you want to delete this task?</DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="secondary">
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
                fullWidth
                value={taskToUpdate.task}
                onChange={(e) => setTaskToUpdate({ ...taskToUpdate, task: e.target.value })}
              />
              <TextField
                sx={{ mt: 1 }}
                label="Description"
                variant="outlined"
                fullWidth
                value={taskToUpdate.description}
                onChange={(e) => setTaskToUpdate({ ...taskToUpdate, description: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleUpdateDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleUpdateTask} color="primary">
                Update
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={addDialogOpen}
            onClose={handleCloseAddDialog}
            aria-labelledby="add-dialog-title"
            aria-describedby="add-dialog-description"
          >
            <DialogTitle id="add-dialog-title">Add Todo</DialogTitle>
            <DialogContent>
              <TextField
                label="Task"
                variant="outlined"
                fullWidth
                value={newTodo.task}
                onChange={(e) => setNewTodo({ ...newTodo, task: e.target.value })}
                sx={{ mt: 1 }}
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                sx={{ mt: 1 }}
              />
              <DialogContentText>Task Cannot be null.</DialogContentText>
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

export default TaskTable;
