import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PublicRoutes } from './router/Routes/PublicRoutes';
import { PrivateRoutes } from './router/Routes/PrivateRoutes';

export const router = createBrowserRouter([
  ...PublicRoutes,
  ...PrivateRoutes,
])

function App() {
  return <RouterProvider router={router} />;
}

export default App