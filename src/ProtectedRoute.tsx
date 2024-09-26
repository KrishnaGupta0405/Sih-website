// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  component: React.ComponentType<any>; // Accept any component type
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  return localStorage.getItem('idToken') ? <Component /> : <Navigate to="/intro" />;
};

export default ProtectedRoute;
