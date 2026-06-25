import { Navigate, Outlet } from 'react-router-dom';
import { Role } from '@/types';
import { pakaiAuthStore } from '@/store/auth';

export const PenjagaAuth = () => {
  const { user } = pakaiAuthStore();
  return user ? <Outlet /> : <Navigate to="/masuk" replace />;
};

// Guard akses admin.
export const PenjagaAdmin = ({ roles }: { roles: Role[] }) => {
  const { user } = pakaiAuthStore();
  if (!user) return <Navigate to="/masuk" replace />;
  return roles.includes(user.role) ? <Outlet /> : <Navigate to="/" replace />;
};
