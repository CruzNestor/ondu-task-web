import type { RouteObject } from "react-router-dom";
import LoginPage from "../../Features/Auth/Pages/LoginPage";
import ErrorPage from "../../Shared/Components/Error/ErrorPage";
import PublicRouteComponent from "../Components/PublicRouteComponent";

export const PublicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicRouteComponent />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <LoginPage />,
      },
    ],
  },
];