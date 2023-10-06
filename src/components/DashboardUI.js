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

export default Dashboard;