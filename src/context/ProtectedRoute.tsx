import { Navigate, Outlet } from 'react-router-dom';
import { PRoute } from '../interfaces/proute.interface';

export const ProtectedRoute = ({ allowedRoles, userRole }: PRoute) => {
  if (userRole && allowedRoles.includes(userRole)) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};
