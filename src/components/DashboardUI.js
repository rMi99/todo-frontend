<<<<<<< HEAD
import React, { useEffect  } from 'react';
import axios from 'axios';
import NavComponent from './NavComponent';
import TaskTable from './TaskTable';

const Dashboard = () => {
    const backgroundStyle = {
        background: `url('/images/bgmain.jpg')`, 
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        minHeight: '100vh', 
      };
      const contentContainerStyle = {
        margin: '20px', 
      };
    
    useEffect(() => {
        const token = localStorage.getItem('token');
       
        
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
        
        <div style={backgroundStyle}>
            <NavComponent />
        
         <div style={contentContainerStyle}>
         <TaskTable />
       </div> </div>
    );
};

=======
import React from 'react';
// import axios from 'axios';
import NavComponent from './NavComponent';
import CardBody from './CardBody';
// import TaskTable from './1';
// import { ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import theme from './theme';

const Dashboard = () => {

    const contentContainerStyle = {
        backgroundColor: '#e3e6f0',
        padding: '20px',
        height: '100vh',
    };

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     axios
    //         .get('http://localhost:8000/api/user', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         })
    //         .then((response) => {
    //             // setUserName(response.data.name);

    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }, []);

    return (

        <div style={contentContainerStyle}>
            <NavComponent />
            <CardBody />
        </div>

    );
};

>>>>>>> do9
export default Dashboard;