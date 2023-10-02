
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login'; // Import your Login component
import Register from './components/Register'; // Import your Register component
import Dashboard from './components/DashboardUI'; 
import { useState, useEffect } from 'react';
const App = () => {
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
