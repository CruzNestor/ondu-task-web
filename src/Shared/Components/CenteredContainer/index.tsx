import { Container, styled, type ContainerProps } from "@mui/material";

interface CenteredContainerProps extends ContainerProps {
    height?: string; // Agregamos la prop height
}

export const CenteredContainer = styled(Container)<CenteredContainerProps>(({ height = '100vh' }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height,
}));
