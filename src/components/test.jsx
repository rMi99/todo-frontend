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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Spinner from './Spinner';
import Avatar from '@mui/material/Avatar';

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
    link: '', // Add 'link' field
    is_completed: false,
    created_at: '', // Add 'created_at' field
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    task: '',
    description: '',
    link: '', // Add 'link' field
    user_id: userId,
    is_completed: false,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
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

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setNewTodo({
      task: '',
      description: '',
      link: '',
      user_id: userId,
      is_completed: false,
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
      link: task.link,
      is_completed: task.is_completed,
      created_at: task.created_at,
    });
    setUpdateDialogOpen(true);
  };

  const handleToggleComplete = (task) => {
    const updatedTask = { ...task, is_completed: !task.is_completed };

    axios
      .put(`http://localhost:8000/api/update/${updatedTask.id}`, updatedTask)
      .then(() => {
        const updatedTasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error('Error updating task:', error);
      });
  };

  const handleConfirmDelete = () => {
    setIsLoading(true);

    if (taskToDeleteId) {
      axios
        .delete(`http://localhost:8000/api/delete/${taskToDeleteId}`)
        .then(() => {
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDeleteId));
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
  // const redirectLink = (link) =>{

  //   window.location.href(task.link);

  // }

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
      
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          <Button variant="contained"  sx={{ mt: 1 }} style={{ backgroundColor: '#9150F0', color: '#ffff'}} onClick={handleOpenAddDialog}>
            Add Todo
          </Button>

          <TextField
            label="Search by ID"
            variant="outlined"
            fullWidth
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Button variant="contained" style={{ backgroundColor: '#9150F0', color: '#ffff'}}
 onClick={handleSearch}>
            Search
          </Button>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {searchedTask ? (
              <Grid item xs={6}>
                <Card >
                  <CardContent>
                    <Avatar alt="avatar" src="" />
                    <Typography variant="h5" component="div">
                      {searchedTask.task}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchedTask.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchedTask.link}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Created at: {searchedTask.created_at}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={searchedTask.is_completed}
                          onChange={() => handleToggleComplete(searchedTask)}
                          name="isCompleted"
                          color="primary"
                        />
                      }
                      label="Completed"
                    />
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handleUpdate(searchedTask)} color="success">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(searchedTask.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ) : (
              tasks.map((task) => (
                <Grid item xs={8} md={4} lg={2} key={task.id}>
                  <Card >
                    <CardContent>
                      {/* <Avatar alt="avatar" src="" /> */}
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={task.is_completed}
                  onChange={() => handleToggleComplete(task)}
                  name="isCompleted"
                  color="primary"
                />
              }
              label="Completed"
            />
          </div>
                      <Typography variant="h5" component="div">
                        {task.task}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                       {/* <a  href='{task.link}'></a> */}
                       <a href={'http://'+task.link} target="_blank" rel="noreferrer"> {task.link} </a>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Created at: {task.created_at}
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
              ))
            )}
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
              <TextField
                sx={{ mt: 1 }}
                label="Link"
                variant="outlined"
                fullWidth
                value={taskToUpdate.link}
                onChange={(e) => setTaskToUpdate({ ...taskToUpdate, link: e.target.value })}
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
              <TextField
                label="Link"
                variant="outlined"
                fullWidth
                value={newTodo.link}
                onChange={(e) => setNewTodo({ ...newTodo, link: e.target.value })}
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
