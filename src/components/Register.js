import React, { useState } from 'react';
<<<<<<< HEAD
import { Grid, Paper, Avatar, Typography, TextField, Button, Snackbar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
=======
import { Grid, Paper, Typography, TextField, Button } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import Spinner from './Spinner';
>>>>>>> do9

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< HEAD
  const [message, setMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(false);

  const handleRegister = async () => {
=======
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

>>>>>>> do9
    try {
      const response = await axios.post('http://localhost:8000/api/register', {
        name,
        email,
        password,
<<<<<<< HEAD
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          'Authorization' : 'application/json',
        },
      });

      // Check if registration was successful
      if (response.data.status === true && response.data.token) {
        
        const token = response.data.token; 
        localStorage.setItem('token', token);

        setMessage('Registration successful. You can now login.');
        setOpenAlert(true);
        

        // localStorage.setItem('token', response.data.token);
        window.location.href = '/login';
       
=======
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
>>>>>>> do9
        setName('');
        setEmail('');
        setPassword('');
      } else {
<<<<<<< HEAD
        // Registration failed
        setMessage('Registration failed. Please try again.');
        setOpenAlert(true);
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.');
      setOpenAlert(true);
    }
  };
  const handleLoginPage =() =>{
    window.location.href = '/login';
  }

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
            style={{ margin: '5px 0',
            backgroundColor: '#79AC78'  }}
          >
            Register
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLoginPage}
            style={{ margin: '5px 0',
             backgroundColor: '#79AC78'  }}
          >
            Back to Login
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
=======
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
>>>>>>> do9
  );
};

export default Register;
