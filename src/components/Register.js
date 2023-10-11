import React, { useState } from 'react';
import { Grid, Paper, Typography, TextField, Button, Snackbar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import Spinner from './Spinner';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 
  const isEmailValid = (email) => {
  
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };



  const handleRegister = async () => {
  
    if (!name || !email || !password) {
      setMessage('Name, email, and password cannot be empty.');
      setOpenAlert(true);
      return;
    }
    if (!isEmailValid(email)) {
      setMessage('Please enter a valid email address.');
      setOpenAlert(true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/register', {
        name,
        email,
        password,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === true && response.data.token) {
  
        localStorage.setItem('user', response.data.username);
        localStorage.setItem('user_id', response.data.user_id);
       
        setIsLoading(false);
        setOpenAlert(true);
        setMessage('Registration successful. You can now login.');

        localStorage.setItem('token', response.data.token);
        window.location.href = '/login';

        setName('');
        setEmail('');
        setPassword('');
      } else {
        setIsLoading(false);
        setMessage('Registration failed. Please try again.');
        setOpenAlert(true);
      }
    } catch (error) {
      setIsLoading(false);
      setMessage('Registration failed. Please try again.');
      setOpenAlert(true);
    }
  };

  const handleLoginClick = () => {
    window.location.href = '/Login';
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  return (
    <div >
      {isLoading ? (
        <Spinner />
      ) : (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' ,opacity: '0.8'}}>
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
             
                <LockOutlinedIcon />
            
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
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleRegister}
                style={{
                  margin: '5px 0',
                  backgroundColor: '#9150F0',
                  color:'white',
                }}
              >
                Register
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLoginClick}
                style={{
                  margin: '5px 0',
                  backgroundColor: '#9150F0',
                }}
              >
                Jump to Login
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
      )}
    </div>
  );
};

export default Register;
