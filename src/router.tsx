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
import { SettingsPage } from "./components/settings/settings-page";
import { LoginPage } from "./components/home/login-page";
import { LoginViaTokenPage } from "./components/home/login-via-token-page";
import { LoginViaTokenSuccessPage } from "./components/home/login-via-token-success-page";
import { ProvisionPage } from "./provision/provision-page";
import { PrivacyPolicy } from "./components/home/privacy-policy";

export const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/token-login",
    element: <LoginViaTokenPage />,
  },
  {
    path: "/token-login/mail-sent",
    element: <LoginViaTokenSuccessPage />,
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
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "provision",
        element: <ProvisionPage />,
      },
    ],
  },
]);
