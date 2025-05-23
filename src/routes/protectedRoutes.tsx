/* eslint-disable @typescript-eslint/no-explicit-any */
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ComponentType } from 'react';

interface ProtectedRouteProps {
    element: ComponentType<any>;
    roles: string[];
    [key: string]: any; // To allow additional props
  }

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Component, roles, ...rest }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user && !roles.includes(user.role)) {
    // navigate(-1);
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired, // kill me
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
