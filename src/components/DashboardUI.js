import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavComponent from './NavComponent';
import TaskTable from './TaskTable';
// import Button from '@mui/material/Button'; // Import Button from Material-UI
// import {  redirect } from 'react-router-dom';
// import PropertyCard from './PropertyCard';



const Dashboard = () => {
    // const [userName, setUserName] = useState('');
    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     window.location.href = '/login';
    //     // alert('logOut');
    //     // return <redirect to="/login" />;
    // };

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        axios
            .get('http://localhost:8000/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                // setUserName(response.data.name);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (

        <div>
            <NavComponent />
            {/* <h2>Welcome, {userName}!</h2> */}
            {/*          
            <Button variant="contained" color="secondary" onClick={handleLogout}>
                Logout
            </Button> */}

            <TaskTable />




        </div>

    );
};

export default Dashboard;
