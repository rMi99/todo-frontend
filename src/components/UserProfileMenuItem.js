import React, { useState } from 'react';
import {

  Typography,
  Paper,
  Grid,

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

import axios from 'axios';
import { toast } from 'react-toastify'; 

function ProfilePage({ userName }) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const userId = localStorage.getItem('user_id');

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

       
        toast.success('Profile updated successfully', { autoClose: 2000 });

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
        <DialogContent style={{ display: 'flex', flexDirection: 'row', maxWidth: '100%' }}>
        
  <Paper elevation={3} style={{ padding: '16px', maxWidth: '600px', margin: '0 auto', marginBottom: '20px' }}>
      
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              
              {/* <Grid item>
        
             
              </Grid> */}
              <Grid item>
                <Typography variant="h6">User Details</Typography>
                {/* <TextField
                  variant="standard"
                  fullWidth
                  margin="normal"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                /> */}
<List>
                <Divider />
                
              <ListItem>
                <ListItemText primary="Name" secondary={<TextField variant="standard" fullWidth value={newName}    onChange={(e) => setNewName(e.target.value)} />} />
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

              </Grid>
           
            </Grid>
          </Paper>

          <Paper elevation={3} style={{ padding: '16px', maxWidth: '700px', margin: '0 auto', marginBottom: '20px' }}>
            <Typography variant="h6">Password Details</Typography>
            <List>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Old Password"
                  secondary={
                    <TextField
                      variant="standard"
                      fullWidth
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="New Password"
                  secondary={
                    <TextField
                      variant="standard"
                      fullWidth
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
