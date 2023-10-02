import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    DialogActions,
    DialogContentText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const TaskTable = () => {
    const [tasks, setTasks] = useState([]);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDeleteId, setTaskToDeleteId] = useState(null);

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
    });



    const [searchId, setSearchId] = useState(''); // New state for search ID
    const [searchedTask, setSearchedTask] = useState(null); // New state to store the searched task

    useEffect(() => {
        // Fetch data using Axios when the component mounts
        axios.get('http://localhost:8000/api/')
            .then((response) => {
                setTasks(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);


    const handleOpenAddDialog = () => {
        setAddDialogOpen(true);
    };

    const handleCloseAddDialog = () => {
        setAddDialogOpen(false);
        setNewTodo({
            task: '',
            description: '',
        });
    };

    const handleAddTodo = () => {
        axios.post('http://localhost:8000/api/create', newTodo)
            .then(() => {
                axios.get('http://localhost:8000/api/')
                    .then((response) => {
                        setTasks(response.data); 
                    })
                    .catch((error) => {
                        console.error('Error fetching updated data:', error);
                    });
                handleCloseAddDialog(); 
            })
            .catch((error) => {
                console.error('Error adding todo:', error);
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
        setTaskToUpdate(task);
    };

    const handleConfirmDelete = () => {
        if (taskToDeleteId) {
            axios.delete(`http://localhost:8000/api/delete/${taskToDeleteId}`)
                .then(() => {
                    setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskToDeleteId));
                    setDeleteSuccess(true);
                    setTaskToDeleteId(null);
                })
                .catch((error) => {
                    console.error('Error deleting task:', error);
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
        axios.put(`http://localhost:8000/api/update/${taskToUpdate.id}`, taskToUpdate)
            .then(() => {
                setUpdateDialogOpen(false);
        
                axios.get('http://localhost:8000/api/')
                    .then((response) => {
                        setTasks(response.data); 
                    })
                    .catch((error) => {
                        console.error('Error fetching updated data:', error);
                    });
            })
            .catch((error) => {
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
        
        axios.get(`http://localhost:8000/api/show/${searchId}`)
            .then((response) => {
                setSearchedTask(response.data);
            })
            .catch((error) => {
                console.error('Error fetching task by ID:', error);
                setSearchedTask(null); 
            });
    };

    return (
        <div  >

            <Button variant="outlined" color="primary" sx={{ mt: 1 }} onClick={handleOpenAddDialog}>
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
            <Button variant="outlined" color="primary" onClick={handleSearch}>
                Search
            </Button>

            {searchedTask ? (


                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell variant="h6" fontWeight="bold">#</TableCell>
                                <TableCell>Task</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            <TableRow key={searchedTask.id}>
                                <TableCell>{searchedTask.id}</TableCell>
                                <TableCell>{searchedTask.task}</TableCell>
                                <TableCell>{searchedTask.description}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleUpdate(searchedTask)} color="success">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(searchedTask.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </TableContainer>

            ) : (
              
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell variant="h6" fontWeight="bold">#</TableCell>
                                <TableCell>Task</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>{task.id}</TableCell>
                                    <TableCell>{task.task}</TableCell>
                                    <TableCell>{task.description}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleUpdate(task)} color="success">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(task.id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

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
                <DialogContent>
                    Are you sure you want to delete this task?
                </DialogContent>
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
                    <DialogContentText>
                        Task Cannot be null.
                    </DialogContentText>
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
    );
};

export default TaskTable;
