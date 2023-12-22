import React from "react";
import { Navigate, Routes } from "react-router-dom";
import { useAuth } from "../../AuthContext"; // Import your AuthContext

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
  const { user } = useAuth();
  const accessToken = localStorage.getItem("access-token");

  if (accessToken && user) {
    return <Routes {...rest}>{children}</Routes>;
  }

  // if (!user) {
  return <Navigate to="/login" />;
  // }
};

export default PrivateRoute;
