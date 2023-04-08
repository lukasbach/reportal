import { createHashRouter } from "react-router-dom";
import { HomePage } from "./components/home/home-page";
import { AppLayout } from "./components/common/app-layout";
import { authCheckLoader } from "./auth";

export const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      {
        path: "dashboard",
        element: <div>Hello Dashboard</div>,
        loader: authCheckLoader,
      },
    ],
  },
]);
