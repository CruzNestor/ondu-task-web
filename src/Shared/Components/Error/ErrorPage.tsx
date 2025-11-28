import { Button, Grid } from "@mui/material";
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const error = useRouteError()
  let errorMessage: string;

  const handleRedirect = () => {
    navigate('/')
  }

  if (isRouteErrorResponse(error)) {
    errorMessage = `(${error.status}) ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = 'Unknown error';
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh', padding: '0 20px' }}
    >
      <Grid size={{ xs: 12, md: 3 }}>
        <div id="error-page">
          <h1>Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <i>{errorMessage}</i>
          </p>
        </div>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Button variant="contained" onClick={() => handleRedirect()}>
          Ir al inicio
        </Button>
      </Grid>
    </Grid>
  );
}

export default ErrorPage;