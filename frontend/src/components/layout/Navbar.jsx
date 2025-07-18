import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="w-full h-16 bg-white shadow flex items-center px-6 justify-between">
      <div className="font-bold text-xl text-blue-700">Drone Dashboard</div>
      <div>
        {/* Add user info, logout button, etc. here */}
        <Button onClick={handleLogout} className="ml-4">Logout</Button>
      </div>
    </nav>
  );
};

export default Navbar; 