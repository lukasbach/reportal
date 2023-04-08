import { createHashRouter } from "react-router-dom";
import React from "react";
import { HomePage } from "./components/home/home-page";
import { AppLayout } from "./components/common/app-layout";
import { authCheckLoader } from "./auth";
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
        element: <ListPage endpoint={new IssueSearchEndpoint()} />,
        loader: authCheckLoader,
      },
    ],
  },
]);
