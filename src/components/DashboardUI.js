import React, { useEffect  } from 'react';
import axios from 'axios';
import NavComponent from './NavComponent';
import TaskTable from './test';
// import TaskTable from './TaskTable';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

const Dashboard = () => {
 
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
        <ThemeProvider theme={theme}>
            <CssBaseline>
        <div>
            <NavComponent />
        
         <div style={contentContainerStyle}>
         <TaskTable />
         
       </div> </div>
       </CssBaseline>
       </ThemeProvider>
    );
};

export default Dashboard;