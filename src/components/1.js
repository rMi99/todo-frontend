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
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleDeleteAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setDeleteSuccess(false);
  };

  const handleSearch = () => {
    setIsLoading(true);

    axios
      .get(`http://localhost:8000/api/show/${searchQuery}/${userId}`)
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

  const filteredTasks = searchQuery
    ? tasks.filter((task) =>
        task.task.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tasks;

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            style={{ backgroundColor: '#9150F0', color: '#ffff' }}
            onClick={handleOpenAddDialog}
          >
            Add Todo
          </Button>

          <TextField
            label="Search by Task Name"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Button
            variant="contained"
            style={{ backgroundColor: '#9150F0', color: '#ffff' }}
            onClick={handleSearch}
          >
            Search
          </Button>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {searchedTask ? (
              <Grid item xs={6}>
                <Card>
                  {/* Render the searched task card here */}
                </Card>
              </Grid>
            ) : (
              filteredTasks.map((task) => (
                <Grid item xs={8} md={4} lg={2} key={task.id}>
                  <Card>
                    {/* Render each task card here */}
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

          {/* Rest of your code for Dialogs and Snackbar */}
        </div>
      )}
    </div>
  );
};

export default TaskTable;
