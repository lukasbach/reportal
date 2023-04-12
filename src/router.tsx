import { createHashRouter } from "react-router-dom";
import React from "react";
import { HomePage } from "./components/home/home-page";
import { AppLayout } from "./components/common/app-layout";
import { authCheckLoader } from "./auth";
import { IssueSearchEndpoint } from "./list-endpoints/issue-search-endpoint";
import { FilterListPage } from "./components/filter-list/filter-list-page";
import { ListsOverviewPage } from "./components/list-overview/lists-overview-page";

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
        element: <FilterListPage endpoint={new IssueSearchEndpoint()} />,
        loader: authCheckLoader,
      },
      {
        path: "lists",
        element: <ListsOverviewPage />,
        loader: authCheckLoader,
      },
    ],
  },
]);
