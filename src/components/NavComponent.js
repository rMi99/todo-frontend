import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
<<<<<<< HEAD
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MoreIcon from '@mui/icons-material/MoreVert';

=======
import MoreIcon from '@mui/icons-material/MoreVert';
// import { Link } from 'react-router-dom';
import UserProfileMenu from './UserProfileMenuItem';
>>>>>>> do9

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
<<<<<<< HEAD

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
    // alert('logOut');
    // return <redirect to="/login" />;
  
};

=======
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const userName = (localStorage.getItem('user'));

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
  

    window.location.href = '/login';
    // return <redirect to="/login" />;
};
>>>>>>> do9

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
<<<<<<< HEAD
=======
  const linkStyle = {
    textDecoration: 'none', 
    color: 'inherit',
};
>>>>>>> do9

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
<<<<<<< HEAD
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
=======
      {/* <Link to='/profile' style={linkStyle} >
       */}
       <MenuItem ><UserProfileMenu style={linkStyle} userName={userName}/></MenuItem>
      {/* <MenuItem >You Login as : {userName}</MenuItem> */}
      {/* </Link> */}
>>>>>>> do9
      <MenuItem onClick={handleLogout}>Log Out</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
     
<<<<<<< HEAD
     <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <ExitToAppIcon />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
=======
     {/* <Link to="/profile"> */}
     {/* <MenuItem >You Login as : {userName}</MenuItem> */}
     <MenuItem><UserProfileMenu userName={userName}/></MenuItem>
     
     {/* </Link> */}
      <MenuItem onClick={handleLogout}>Log Out</MenuItem>
   
>>>>>>> do9
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
<<<<<<< HEAD
      <AppBar position="static" sx={{ backgroundColor: '#79AC78' }}>
=======
      <AppBar position="static" sx={{ backgroundColor: 'white',color: '#9150F0'}}>
     
>>>>>>> do9
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
<<<<<<< HEAD
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
           Todo Application
=======
            sx={{ display: { xs: 'none', sm: 'block' ,fontFamily:'system-ui', } }}
          >
           Well-Timed
>>>>>>> do9
          </Typography>
        
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            
    
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
    
  );
  
}




