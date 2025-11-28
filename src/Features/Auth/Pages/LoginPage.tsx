import { useRef, useState } from 'react';
import { useAppDispatch } from '../../../redux/Hooks';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Typography, IconButton, useTheme, Toolbar } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '../../../Shared/Components/LoadingButton';
import { FormSection } from '../Components/ComponentsStyled';
import AxiosHelper, { type AxiosConfig } from '../../../Services/AxiosHelper';
import { showAlertAsync } from '../../../Shared/Components/SweetAlert';
import type { AuthApiModel, Credentials } from '../Models/AuthModels';
import { login } from '../../../redux/Slices/AuthSlice';
import { CenteredContainer } from '../../../Shared/Components/CenteredContainer';
import type { ResponseModel } from '../../../Shared/Models/GlobalModels';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, nextFieldRef?: React.RefObject<HTMLInputElement | null>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (nextFieldRef?.current) {
        nextFieldRef.current.focus();
      } else {
        handleLogin();
      }
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    if (userName === '' || password === '') {
      await showAlertAsync({
        title: 'Aviso',
        icon: 'info',
        html: 'Complete todos los campos'
      })
      setLoading(false);
      return;
    }

    const data: Credentials = {
      userName,
      password
    }

    const config: AxiosConfig = {
      url: 'Auth/login',
      method: 'POST',
      data: data,
      contentType: 'application/json'
    }

    try {
      const response = await AxiosHelper.fetch<ResponseModel<AuthApiModel>>(config);
      if (response) {
        dispatch(login({ authenticated: true, token: response.data.token }));
        navigate('/');
      }
    } catch (error) {
      await showAlertAsync({
        title: 'Error',
        icon: 'error',
        html: error instanceof Error ? error.message : 'Ocurrió un error inesperado'
      })
    }
    setLoading(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box sx={{ background: theme.palette.background.default }}>
      <Toolbar />
      <CenteredContainer height='calc(100vh - 70px)'>
        <FormSection>
          <Typography variant='h5'>Inicio de sesión</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 3 }}>
            Por favor ingresa tus credenciales para continuar.
          </Typography>
          <TextField
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUserName(event.target.value)}
            label="Usuario"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={userName}
            inputRef={usernameRef}
            onKeyDown={(event) => handleKeyDown(event, passwordRef)}
            sx={{ marginTop: 3 }}
          />
          <TextField
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={password}
            inputRef={passwordRef}
            onKeyDown={(event) => handleKeyDown(event)}
            sx={{
              '& .MuiInputBase-root': {
                padding: 0,
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    sx={{ position: 'absolute', right: 5 }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              },

            }}
          />
          <LoadingButton
            onClick={handleLogin}
            isLoading={loading}
            width='100%'
            text='Iniciar sesión'
            height='50px'
          />
        </FormSection>

      </CenteredContainer>
    </Box>
  );
};

export default LoginPage;
