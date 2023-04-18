import { createHashRouter } from "react-router-dom";
import React from "react";
import { HomePage } from "./components/home/home-page";
import { AppLayout } from "./components/common/app-layout";
import { ListsOverviewPage } from "./components/filter-list/lists-overview-page";
import { FilterListPage } from "./components/filter-list/filter-list-page";
import { DashboardPage } from "./components/dashboard/dashboard-page";
import { DashboardsOverviewPage } from "./components/dashboard/dashboards-overview-page";
import { withAuthWrapper } from "./auth/with-auth-wrapper";
import { AppMainpageReroute } from "./app-mainpage-reroute";

export const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/app",
    element: withAuthWrapper(<AppLayout />),
    children: [
      { path: "", element: <AppMainpageReroute /> },
      {
        path: "dashboards",
        element: <DashboardsOverviewPage />,
      },
      {
        path: "dashboards/:id",
        element: <DashboardPage />,
      },
      {
        path: "filterlists",
        element: <ListsOverviewPage />,
      },
      {
        path: "filterlists/:id",
        element: <FilterListPage />,
      },
    ],
  },
]);
