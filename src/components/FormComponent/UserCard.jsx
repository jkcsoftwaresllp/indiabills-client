import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  IconButton
} from '@mui/material';

const UserCard = ({ 
  id, 
  avatar, 
  name, 
  email, 
  username, 
  role, 
  jobTitle, 
  department 
}) => {
  const navigate = useNavigate();

  const handleViewUser = () => {
    navigate(`/users/${id}`);
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'error';
      case 'manager': return 'warning';
      case 'operator': return 'info';
      case 'customer': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card className="w-64 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <CardContent className="text-center p-4">
        <div className="relative">
          <Avatar
            src={avatar}
            alt={name}
            sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
          />
          <IconButton
          className="absolute top-0 right-0"
          onClick={handleViewUser}
          size="small"
          sx={{ 
          backgroundColor: 'rgba(0,0,0,0.1)', 
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' } 
          }}
          >
          <FiEye />
          </IconButton>
        </div>
        
        <Typography variant="h6" className="font-bold mb-1 truncate">
          {name}
        </Typography>
        
        {username && (
          <Typography variant="body2" color="textSecondary" className="mb-2">
            @{username}
          </Typography>
        )}
        
        <Typography variant="body2" color="textSecondary" className="mb-2 truncate">
          {email}
        </Typography>
        
        <Chip 
          label={role} 
          color={getRoleColor(role)} 
          size="small" 
          className="capitalize mb-2"
        />
        
        {jobTitle && (
          <Typography variant="caption" display="block" color="textSecondary">
            {jobTitle}
          </Typography>
        )}
        
        {department && (
          <Typography variant="caption" display="block" color="textSecondary">
            {department}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;