import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import './CardBody.css';
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
} from '@mui/material';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Spinner from './Spinner';
import Switch from '@mui/material/Switch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CardBody.css'

const CardBody = () => {

  const [startDate, setStartDate] = useState(new Date());

  // const [value, setValue] = useState(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const userId = localStorage.getItem('user_id');
  const [tasks, setTasks] = useState([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState({
    id: null,
    task: '',
    description: '',
    link: '',
    is_completed: false,
    created_at: '',
    due_date: Date,
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    task: '',
    description: '',
    link: '',
    user_id: userId,
    is_completed: false,
    due_date: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/task/${userId}`)
      .then((response) => {
        setTasks(response.data);
      
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
       
      });
  }, [userId]);

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setNewTodo({
      task: '',
      description: ' ',
      link: ' ',
      user_id: userId,
      is_completed: false,
      due_date:'',
    });
  };
  const handleAddTodo = () => {
  
    if (newTodo.task.trim() === '') {
      setNewTodo({ ...newTodo, error: true });
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
            toast("successfully Added..!!");
          })
          .catch((error) => {
            console.error('Error fetching updated data:', error);
            setIsLoading(false);
    toast.error('Error!! Plz Check Your Internet Connection(DB).. task:', error);

          });
        handleCloseAddDialog();
      })
      .catch((error) => {
        console.error('Error adding todo:', error);
        setIsLoading(false);
    toast.error('Error!! Plz Check Your Internet Connection(DB).. task:', error);

      });
  };

  const handleDelete = (id) => {
    setTaskToDeleteId(id);
    setDeleteDialogOpen(true);
    setSnackbarMessage("Deleted");


  };

  const handleUpdate = (task) => {
    setTaskToUpdate({
      id: task.id,
      task: task.task,
      description: task.description,
      link: task.link,
      is_completed: task.is_completed,
      created_at: task.created_at,
      due_date:task.due_date,
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
    toast.error('Error!! Plz Check Your Internet Connection(DB).. task:', error);

      });
  };

  const handleConfirmDelete = () => {

    if (taskToDeleteId) {
      axios
        .delete(`http://localhost:8000/api/delete/${taskToDeleteId}`)
        .then(() => {
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDeleteId));
          setFilteredTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDeleteId));
       
          setTaskToDeleteId(null);
          setIsLoading(false);
    toast.error("Successfully Deleted..!!");

        })
        .catch((error) => {
          console.error('Error deleting task:', error);
    toast.error('Error deleting task:', error);

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
        toast.success('Task Updated successfully', { autoClose: 3000 });
        setFilteredTasks(response.data);
          })
          .catch((error) => {
            console.error('Error fetching updated data:', error);
    toast.error('Error!! Plz Check Your Internet Connection(DB).. task:', error);
            
            setIsLoading(false);
          });
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error updating task:', error);
      });
  };


  const handleSearch = () => {
    const filtered = tasks.filter((task) =>
      task.task.toLowerCase().includes(searchId.toLowerCase()) &&
      (showCompletedTasks ? task.is_completed : true)
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

<div style={{ display: 'flex', justifyContent: 'flex-end' }}>

<FormControlLabel
  control={
    <Switch
      checked={showCompletedTasks}
      onChange={() => setShowCompletedTasks(showCompletedTasks)}
      name="showCompletedTasks"
      color="primary"
    />
  }
  label="Show Completed"
  sx={{
    marginTop: 2,
    marginLeft: '10px',
  }}
/>
  <Button
    variant="contained"
    sx={{
      mt: 1,
    }}
    style={{ backgroundColor: '#9150F0', color: '#ffffff' }}
    onClick={handleOpenAddDialog}
    startIcon={<AddIcon />}
  >
    Add Todo
  </Button>
</div>


<div>
<TextField 
  placeholder="   Enter task name..." 
  variant="standard" 
  fullWidth
  value={searchId}
  className="srchBox"
  onChange={(e) => setSearchId(e.target.value)}
  InputProps={{
    style: {
      borderBottom: '3px solid #9150F0',
      justifyContent: 'center',
      top: '-115px',
      width: '23%',
      left: '64.5%',
      borderRadius: '10px',
    },
  }}
  InputLabelProps={{
    shrink: true, 
  }}
  sx={{ mt: 2.5 }}
/>
</div>

<div>
      {filteredTasks.length === 0 ? ( 
       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='img-style'>

          <img src='./images/no.svg' style={{width:'30%',height:'25%',}} alt="No Task Found" className='img-style' />
         
        </div>
         
      ) : (
        <Grid container spacing={2} sx={{ mt: 1 }} style={{ justifyContent: 'center'}}>
          {filteredTasks.map((task) => (
            <Grid item xs={8} md={4} lg={2} key={task.id}>
              <Card>
              <CardHeader 
  title={task.task}
  style={{
    borderBottom: '2px solid #c1a4eb'
    // borderBottom: '2px solid #E3E6F0'
  }}
/>
                <CardContent sx={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={task.is_completed}
                          onChange={() => handleToggleComplete(task)}
                          name="isCompleted"
                          className={task.is_completed ? 'checked-checkbox' : 'unchecked-checkbox'}
                        />
                      }
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        position: 'absolute',
                        top: '-55px',
                        right: '0px',
                        
                      }}
                    />
                  </div>
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{     position: 'relative',
    top: '39px' }}>
                    <a href={'http://' + task.link} target="_blank" rel="noreferrer">
                      {task.link}
                    </a>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ position: 'absolute', top: '97px' }}>
                    {task.created_at}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton onClick={() => handleUpdate(task)} color="#9150F0">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(task.id)} color="#9150F0">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
  <ToastContainer position="top-right" autoClose={5000} theme='dark' />
    </div>
  

          <Dialog
            open={deleteDialogOpen}
            onClose={handleCancelDelete}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
            <DialogContent>Are you sure you want to delete this task?</DialogContent>
            <DialogActions>
            <Button onClick={handleCancelDelete} style={{ backgroundColor: '#9150F0', color: 'white' }}>
  Cancel
</Button>
<Button onClick={handleConfirmDelete} style={{ backgroundColor: '#9150F0', color: 'white' }}>
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
                onChange={(e) =>
                  setTaskToUpdate({ ...taskToUpdate, description: e.target.value })
                }
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
              <Button onClick={handleUpdateDialogClose} style={{ backgroundColor: '#9150F0', color: 'white' }}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTask} style={{ backgroundColor: '#9150F0', color: 'white' }}>
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
            <DialogTitle id="add-dialog-title"  >Add Todo</DialogTitle>
            <DialogContent>
            <TextField
      label="Task"
      variant="outlined"
      fullWidth
      value={newTodo.task}
      onChange={(e) => setNewTodo({ ...newTodo, task: e.target.value, error: false })}
      error={newTodo.error}
      sx={{ mt: 2 }}
      InputProps={{
        style: {
          borderBottom: newTodo.error ? '1px solid red' : '1px solid #000',
        },
      }}
      InputLabelProps={{
        shrink: true,
      }}
    />
    {newTodo.error && (
      <Typography color="error">
        We Require The Task Field.
      </Typography>
    )}
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                value={newTodo.description}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, description: e.target.value })
                }
                sx={{ mt: 1 }}
              />
              <TextField
                label="Link"
                variant="outlined"
                fullWidth
                value={newTodo.link}
                onChange={(e) => setNewTodo({ ...newTodo, link: e.target.value })}
                sx={{ mt: 2 }}
              />
  <div style={{marginTop:'15px',}}> 
  <span class="corner-span">When to do    :</span> 
   <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      style={{marginTop:'13px',}}
      
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



