import React, { useState, useEffect } from 'react';
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
import { toast } from 'react-toastify';

function ProfilePage({ userName }) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    fetchUserDetails();
  },);

  const fetchUserDetails = () => {
    axios
      .get(`http://localhost:8000/api/user/${userId}`)
      .then((response) => {
        const userData = response.data;
        setNewName(userData.name);
        setNewEmail(userData.email);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEmailBlur = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!newEmail.match(emailPattern)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordBlur = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
    } else {
      setPasswordError('');
    }
  };

  const handleSaveChanges = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    if (emailError) {
      toast.error('Please provide a valid email address.');
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

        toast.success('Profile updated successfully', { autoClose: 2000 });

        userData[newPassword] = null;

        handleClose();
      })
      .catch((error) => {
        console.error(error);

        toast.error('Failed to update profile');
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
                <Typography variant="h5">User's Name</Typography>
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
            <List>
              <ListItem>
                <ListItemText primary="Name" secondary={<TextField variant="standard" fullWidth value={newName}  onChange={(e) => setNewName(e.target.value)}  />} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="E-Mail"
                  secondary={
                    <TextField
                      variant="standard"
                      fullWidth
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)} 
                      onBlur={handleEmailBlur}
                      error={emailError.length > 0}
                      helperText={emailError}
                    />
                  }
                />
              </ListItem>
            </List>
          </Paper>

          <Paper elevation={3} style={{ padding: '16px', maxWidth: '600px', margin: '20px auto' }}>
            <List>
              <ListItem>
                <ListItemText
                  primary="New Password"
                  secondary={
                    <TextField
                      variant="standard"
                      fullWidth
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} 
                      onBlur={handlePasswordBlur}
                      error={passwordError.length > 0}
                      helperText={passwordError}
                    />
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Confirm Password"
                  secondary={
                    <TextField
                      variant="standard"
                      fullWidth
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      onBlur={handlePasswordBlur}
                      error={passwordError.length > 0}
                      helperText={passwordError}
                    />
                  }
                />
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
