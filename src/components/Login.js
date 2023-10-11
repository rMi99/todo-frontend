import React, { useState } from 'react';
import { Grid, Paper, Typography, TextField, Button, Snackbar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Spinner from './Spinner';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 
  const backgroundStyle = {
    backgroundColor: '#e3e6f0',
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Email and password cannot be empty.');
      setOpenAlert(true);
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(email)) {
      setMessage('Please enter a valid email address.');
      setOpenAlert(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      const token = response.data.token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const username = response.data.name;
      const userId = response.data.id;

      localStorage.setItem('user', `${username}`);
      localStorage.setItem('user_id', `${userId}`);
      localStorage.setItem('token', `${token}`);

      window.location.href = '/dashboard';
      setIsLoading(false);
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
      setOpenAlert(true);
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    window.location.href = '/register';
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <div style={backgroundStyle}>
      {isLoading ? (
        <Spinner />
      ) : (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' ,opacity: '0.8'}}>
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
           
                <LockOutlinedIcon />
           
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
                style={{
                  margin: '5px 0',
                  backgroundColor: '#9150F0',
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleRegisterClick}
                style={{
                  margin: '5px 0',
                  backgroundColor: '#9150F0',
                }}
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
      )}
    </div>
  );
};

export default Login;
