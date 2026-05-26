import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  getProfileRouteByRole,
  getStoredToken,
  getStoredUser,
} from '../api/authApi';

function ProtectedRoute({ allowedRoles = [] }) {
  const location = useLocation();
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles.length > 0) {
    const currentRole = user?.role;

    if (!currentRole) {
      return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (!allowedRoles.includes(currentRole)) {
      return <Navigate to={getProfileRouteByRole(currentRole)} replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;
