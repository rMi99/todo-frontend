
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login'; // Import your Login component
import Register from './components/Register'; // Import your Register component
import Dashboard from './components/DashboardUI'; 
import { useState, useEffect } from 'react';

import axios from 'axios';
const App = () => {
    


axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';


axios.defaults.withCredentials = true;


axios.interceptors.request.use(function (config){
  const token = localStorage.getItem('auth_token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check authentication status when the app loads
    useEffect(() => {
        // Implement your authentication logic here, e.g., check for a token in local storage.
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
                <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
                <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
              
                <Route path="/*" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
