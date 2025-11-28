// theme.ts
import { createTheme, type Theme } from '@mui/material/styles';
import { type SxProps } from '@mui/material';

// Augment the palette
declare module '@mui/material/styles' {
  interface Palette {
    outline: Palette['primary'];
  }

  interface PaletteOptions {
    outline?: PaletteOptions['primary'];
  }
}

// Update the Button's color options
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    outline: true;
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    outline: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#769CDF', // Color primario
      contrastText: '#ffffff', // Color del texto para botones, etc.
    },
    secondary: {
      main: '#8991A2', // Color secundario
      contrastText: '#ffffff',
    },
    error: {
      main: '#BA1A1A',
    },
    warning: {
      main: '#FE7A36',
    },
    info: {
      main: '#8c4e2f',
    },
    success: {
      main: '#2D9596',
    },
    background: {
      default: '#f9f9ff', // Fondo principal
      paper: '#ffffff', // Fondo para tarjetas y modales
    },
    outline: {
      main: '#6B6461',
      light: '#888380',
      dark: '#4A4643',
      contrastText: '#FFFFFF'
    },
    text: {
      primary: '#212529', // Color de texto principal
      secondary: '#6c757d', // Color de texto secundario
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Define una fuente personalizada
    h1: { fontSize: '2.5rem', fontWeight: 500 },
    h2: { fontSize: '2rem', fontWeight: 500 },
    body1: { fontSize: '1rem', color: '#212529' },
  },
});

export const IconButtonStyle: {sx: SxProps<Theme>} = {
  sx: {
    bgcolor: 'action.hover', 
    '&:hover': {
      bgcolor: 'action.selected', // Cambia el fondo en hover
    }
  }
};

export default theme;
