import React, { useState } from 'react';
import { Grid, Paper, Typography, TextField, Button } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Spinner from './Spinner';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import GoogleIcon from '@mui/icons-material/Google';
// import { useHistory } from 'react-router-dom';

const Login = () => {
  // const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const backgroundStyle = {
    backgroundColor: '#e3e6f0',
  };
<<<<<<< HEAD
 

=======
  const handleLoginWithGoogle = async () => {
>>>>>>> do9

    window.location.href = 'http://localhost:8000/api/auth/google/callback';
    }


  
  const handleLogin = async () => {
    // Reset error messages
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email cannot be empty.');
      return;
    }

    if (!password) {
      setPasswordError('Password cannot be empty.');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email address.');
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
      setPasswordError('Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    window.location.href = '/register';
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
                onClick={handleLoginWithGoogle}
                style={{
                  margin: '5px 0',
                  backgroundColor: '#9150F0',
                }}
              >
                <IconButton style={{ marginRight: '8px' }} color="inherit">
                  <GoogleIcon />
                </IconButton>
                Login with Google
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
            </Paper>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Login;
