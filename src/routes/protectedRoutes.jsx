import PropTypes from 'prop-types';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { checkSession } from '../network/api';
import { setSession, setOrganizationContext, getSessions } from '../utils/authHelper';
import { CircularProgress, Box } from '@mui/material';
import { getSession } from '../utils/cacheHelper';

const ProtectedRoute = ({ element: Component, roles, ...rest }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessionValid, setSessionValid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('token');
      const currentSession = getSessions();
      
      if (!token || !currentSession) {
        setSessionValid(false);
        setLoading(false);
        return;
      }

      try {
        const response = await checkSession();
        if (response.status === 200 && response.data.valid) {
          // Session is valid, update user data if needed
          const { user: serverUser, activeOrg } = response.data;
          
          // Update session with fresh data from server
          const updatedSession = {
            ...currentSession,
            id: serverUser.id,
            name: serverUser.name,
            email: serverUser.email,
            username: serverUser.username,
            role: activeOrg?.role?.toLowerCase() || currentSession.role,
            organizationId: activeOrg?.orgId || currentSession.organizationId,
            orgs: serverUser.orgs || currentSession.orgs,
            token: token
          };
          
          setSession(updatedSession);
          
          // Update organization context if activeOrg exists
          if (activeOrg) {
            const orgData = serverUser.orgs?.find(org => org.orgId === activeOrg.orgId);
            if (orgData) {
              setOrganizationContext({
                id: activeOrg.orgId,
                name: orgData.name || 'Organization',
                domain: orgData.domain,
                subdomain: orgData.subdomain,
                logoUrl: orgData.logoUrl,
                role: activeOrg.role.toLowerCase()
              });
            }
          }
          
          setSessionValid(true);
        } else {
          // Session is invalid, clear and redirect to login
          localStorage.clear();
          setSessionValid(false);
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        // On error, clear session and redirect to login
        localStorage.clear();
        setSessionValid(false);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  // Show loading while validating session
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if session is invalid
  if (sessionValid === false) {
    return <Navigate to="/login" />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
