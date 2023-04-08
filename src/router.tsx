import { createHashRouter } from "react-router-dom";
import { Box } from "@primer/react";
import { HomePage } from "./components/home/home-page";
import { AppLayout } from "./components/common/app-layout";
import { authCheckLoader } from "./auth";
import { SearchInput } from "./components/list/search-input";
import { IssueSearchEndpoint } from "./list-endpoints/issue-search-endpoint";
import { ListPage } from "./components/list/list-page";

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
        element: <ListPage />,
        loader: authCheckLoader,
      },
    ],
  },
]);
