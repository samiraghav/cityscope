import { Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';

interface PrivateRouteProps {
  children: ReactElement;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
