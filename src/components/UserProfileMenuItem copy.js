import React, { useState } from 'react';
import {
  Avatar,
  Typography,
  Paper,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
// import NavComponents  from './NavComponent';

function ProfilePage({ userName }) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [newEmail, setNewEmail] = useState(userName);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const userId = localStorage.getItem('user_id');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveChanges = () => {
    if (newPassword !== confirmPassword) {

      alert("New password and confirm password don't match.");
      return;
      
    }

    const userData = {
      name: newName,
      email: newEmail,
      password: newPassword,
    };

    axios
      .put(`http://localhost:8000/api/user/change/${userId}`, userData)
      
      .then((response) => {
        localStorage.setItem('user', newName);

        console.log(response.data);
     
        // NavComponents.handleMenuClose();
        handleClose();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
  };

  return (
    <div>
      <Button style={linkStyle} onClick={handleOpen}>
        {userName}
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          <Paper elevation={3} style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item>
                <Avatar style={{ width: '100px', height: '100px' }}>
                  <AccountCircleIcon style={{ width: '100%', height: '100%' }} />
                </Avatar>
              </Grid>
              <Grid item>
                <Typography variant="h5">U</Typography>
                <TextField
                  variant="standard"
                  fullWidth
                  margin="normal"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </Grid>
              <Grid item>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} style={{ padding: '16px', maxWidth: '600px', margin: '20px auto' }}>
            <Typography variant="h6">User Details</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Name" secondary={<TextField variant="standard" fullWidth value={newName} />} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="E-Mail" secondary={<TextField variant="standard" fullWidth value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Old Password" secondary={<TextField variant="standard" fullWidth type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="New Password" secondary={<TextField variant="standard" fullWidth type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />} />
              </ListItem>
            </List>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProfilePage;
