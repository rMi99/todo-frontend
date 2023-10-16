
import React from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NavComponent from './NavComponent';

const ProfilePage = () => {
  return (
    <div>
      <NavComponent/>
      <Paper elevation={3} style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>
            <Avatar style={{ width: '100px', height: '100px' }}>
              <AccountCircleIcon style={{ width: '100%', height: '100%' }} />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h5">User's Name</Typography>
            <Typography variant="body2" color="textSecondary">user@email.com</Typography>
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
            <ListItemText primary="First Name" secondary="User's First Name" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Last Name" secondary="User's Last Name" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Email" secondary="user@email.com" />
          </ListItem>
        </List>
      </Paper>
    </div>
  );
};

export default ProfilePage;
