import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login'; 
import Register from './components/Register'; 
import Dashboard from './components/DashboardUI'; 
// import UserProfile from './components/UserProfile'; 

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
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
                <Route exact path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
                <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
                <Route exact path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                {/* <Route exact path="/profile" element={isLoggedIn ? <UserProfile /> : <Navigate to="/login" />} /> */}
                <Route path="/*" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
