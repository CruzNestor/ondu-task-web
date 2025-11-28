import type { RouteObject } from "react-router-dom";
import PrivateRouteComponent from "../Components/PrivateRouteComponent";
import ErrorPage from "../../Shared/Components/Error/ErrorPage";
import TaskPage from "../../Features/Tasks/Pages/TaskPage";

export const PrivateRoutes: RouteObject[] = [
  {
    path: "/task",
    element: <PrivateRouteComponent />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "list",
        element: <TaskPage />,
      },
    ],
  },
];