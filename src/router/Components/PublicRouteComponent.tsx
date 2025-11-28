import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../redux/Hooks';

const PublicRouteComponent: React.FC = () => {
  const authenticated = useAppSelector((state) => state.auth.authenticated);
  return authenticated ? <Navigate to="/task/list" /> : <Outlet />;
};

export default PublicRouteComponent;