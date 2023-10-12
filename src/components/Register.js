import React, { useState } from 'react';
import { Grid, Paper, Typography, TextField, Button } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import Spinner from './Spinner';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const handleRegister = async () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setMessage(''); 

    if (!name) {
      setNameError('Name cannot be empty.');
      return;
    }
    if (!email) {
      setEmailError('Email cannot be empty.');
      return;
    } else if (!isEmailValid(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setPasswordError('Password cannot be empty.');
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
        setMessage('Registration successful. You can now login.');
        localStorage.setItem('token', response.data.token);
        window.location.href = '/login';
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setIsLoading(false);
        setMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      setIsLoading(false);
      setMessage('Registration failed. Please try again.');
    }
  };

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', opacity: '0.8' }}>
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
                error={!!nameError}
                helperText={nameError}
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ margin: '10px 0' }}
                error={!!emailError}
                helperText={emailError}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ margin: '10px 0' }}
                error={!!passwordError}
                helperText={passwordError}
              />
              {message && (
                <Typography color={message.includes('successful') ? 'primary' : 'error'} variant="body2">
                  {message}
                </Typography>
              )}
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleRegister}
                style={{
                  margin: '5px 0',
                  backgroundColor: '#9150F0',
                  color: 'white',
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
            </Paper>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Register;
