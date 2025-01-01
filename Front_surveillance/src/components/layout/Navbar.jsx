import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Menu, MenuItem } from '@mui/material';
import { Person, Logout, Dashboard, School, Assignment, 
         Visibility, Schedule, Business, MeetingRoom, Category } from '@mui/icons-material';
import './Navbar.css';
import axios from 'axios';


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState({
    username: '',
    role: 'Administrator'  
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users/profile/1');
      setUserInfo({
        username: response.data.username || 'User',  
        role: 'Administrator'  
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Keep the default values in case of error
    }
  };
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfilesClick = () => {
    navigate("/profile");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // ... keep other handlers ...

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="nav-brand">
          <School className="brand-icon" />
          <span className="brand-text">ENSAJ</span>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
              <Dashboard className="nav-icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/exams" className={`nav-item ${isActive('/exams') ? 'active' : ''}`}>
              <Assignment className="nav-icon" />
              <span>Exams</span>
            </Link>
          </li>
          <li>
            <Link to="/surveillance" className={`nav-item ${isActive('/surveillance') ? 'active' : ''}`}>
              <Visibility className="nav-icon" />
              <span>Surveillance</span>
            </Link>
          </li>
          <li>
            <Link to="/departments" className={`nav-item ${isActive('/departments') ? 'active' : ''}`}>
              <Business className="nav-icon" />
              <span>Départements</span>
            </Link>
          </li>
          <li>
            <Link to="/locals" className={`nav-item ${isActive('/locals') ? 'active' : ''}`}>
              <MeetingRoom className="nav-icon" />
              <span>Locaux</span>
            </Link>
          </li>
          <li>
            <Link to="/options" className={`nav-item ${isActive('/options') ? 'active' : ''}`}>
              <Category className="nav-icon" />
              <span>Options</span>
            </Link>
          </li>
        </ul>

        <div className="nav-profile" onClick={handleProfileClick}>
          <Avatar className="profile-avatar">
            {userInfo.username ? userInfo.username[0].toUpperCase() : 'U'}
          </Avatar>
          <div className="profile-info">
            <span className="profile-name">{userInfo.username}</span>
            <span className="profile-role">{userInfo.role}</span>
          </div>
        </div>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          className="profile-menu"
        >
          <MenuItem className="menu-item">
            <Person className="menu-icon"/>
            <span onClick={handleProfilesClick}>Mon Profile</span>
          </MenuItem>
          <MenuItem className="menu-item logout">
            <Logout className="menu-icon" />
            <span>Déconnexion</span>
          </MenuItem>
        </Menu>
      </nav>
    </div>
  );
};

export default Navbar;