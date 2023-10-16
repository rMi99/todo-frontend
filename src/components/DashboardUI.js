import React, { useEffect  } from 'react';
import axios from 'axios';
import NavComponent from './NavComponent';
import TaskTable from './CardBody';
// import TaskTable from './TaskTable';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

const Dashboard = () => {
<<<<<<< HEAD
 
=======
    // const backgroundStyle = {
    //     background: `url('/images/bgmain.jpg')`, 
    //     backgroundSize: 'cover',
    //     backgroundRepeat: 'no-repeat',
    //     backgroundPosition: 'center center',
    //     minHeight: '100vh', 
    //   };
>>>>>>> b2ffa93cbc59aea89b3e81700c9035b20fe3f9c5
      const contentContainerStyle = {
        backgroundColor: '#e3e6f0', 
        padding: '20px',
        height: '100vh',
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
<<<<<<< HEAD
        <ThemeProvider theme={theme}>
            <CssBaseline>
        <div style={contentContainerStyle}>
=======
        
        <div>
>>>>>>> b2ffa93cbc59aea89b3e81700c9035b20fe3f9c5
            <NavComponent />
        
         <div>
         <TaskTable />
         
       </div> </div>
       </CssBaseline>
       </ThemeProvider>
    );
};

export default Dashboard;