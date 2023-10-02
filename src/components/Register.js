import React, { useState } from 'react';
import { Grid, Paper, Avatar, Typography, TextField, Button, Snackbar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/register', {
        name,
        email,
        password,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if registration was successful
      if (response.data.status === true && response.data.token) {
        // Registration success
        setMessage('Registration successful. You can now login.');
        setOpenAlert(true);
        

        localStorage.setItem('token', response.data.token);
        window.location.href = '/login';
       
        setName('');
        setEmail('');
        setPassword('');
      } else {
        // Registration failed
        setMessage('Registration failed. Please try again.');
        setOpenAlert(true);
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.');
      setOpenAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
          <Avatar style={{ margin: 'auto', backgroundColor: '#f50057' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" style={{ marginTop: '10px' }}>
            Register
          </Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ margin: '20px 0' }}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ margin: '10px 0' }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ margin: '10px 0' }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleRegister}
            style={{ margin: '20px 0' }}
          >
            Register
          </Button>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={openAlert}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
            message={message}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Register;
