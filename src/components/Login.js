

import React, { useState } from 'react';
import { Grid, Paper, Avatar, Typography, TextField, Button, Snackbar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import axios from 'axios';
// import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
// const token = null;
  
    const handleLogin = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/login', {
          email,
          password,
          // headers: { Authorization: `Bearer ${localStorage.usertoken}` }
        });
    
        const token = response.data.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
   
        localStorage.setItem('token', response.data.token);
        window.location.href = '/dashboard';
      } catch (error) {
        setMessage('Login failed. Please check your credentials.');
        setOpenAlert(true);
      }
    };
    const handleRegisterClick = () => {
       
      window.location.href = '/register';
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
            Login
          </Typography>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ margin: '20px 0' }}
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
            onClick={handleLogin}
            style={{ margin: '5px 0',
             backgroundColor: '#79AC78'  }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleRegisterClick}
            style={{ margin: '5px 0',
             backgroundColor: '#79AC78'  }}
          >
            Register
          </Button>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={openAlert}
            autoHideDuration={3000}
            onClose={handleCloseAlert}
            message={message}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
