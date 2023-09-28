import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; // Import your AuthContext

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Route {...rest}>{children}</Route>;
};

export default PrivateRoute;
