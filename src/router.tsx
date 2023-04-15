import { createHashRouter } from "react-router-dom";
import React from "react";
import { HomePage } from "./components/home/home-page";
import { AppLayout } from "./components/common/app-layout";
import { authCheckLoader } from "./auth";
import { IssueSearchEndpoint } from "./list-endpoints/issue-search-endpoint";
import { FilterListContainer } from "./components/filter-list/filter-list-container";
import { ListsOverviewPage } from "./components/filter-list/lists-overview-page";
import { FilterListPage } from "./components/filter-list/filter-list-page";
import { DashboardPage } from "./components/dashboard/dashboard-page";
import { DashboardsOverviewPage } from "./components/dashboard/dashboards-overview-page";

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
        path: "dashboards",
        element: <DashboardsOverviewPage />,
        loader: authCheckLoader,
      },
      {
        path: "dashboards/:id",
        element: <DashboardPage />,
        loader: authCheckLoader,
      },
      {
        path: "filterlists",
        element: <ListsOverviewPage />,
        loader: authCheckLoader,
      },
      {
        path: "filterlists/:id",
        element: <FilterListPage />,
        loader: authCheckLoader,
      },
    ],
  },
]);
