import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/Hooks';
import { Root } from '../../Shared/Components/Root';


const PrivateRouteComponent: React.FC = () => {
  const { authenticated } = useAppSelector(state => state.auth);

  if (!authenticated) {
    return <Navigate to="/" />;
  }

  return <Root/>;
};

export default PrivateRouteComponent;
