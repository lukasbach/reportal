import { createHashRouter } from "react-router-dom";
import { Box } from "@primer/react";
import { HomePage } from "./components/home/home-page";
import { AppLayout } from "./components/common/app-layout";
import { authCheckLoader } from "./auth";
import { SearchInput } from "./components/list-search/search-input";
import { IssueSearchEndpoint } from "./list-endpoints/issue-search-endpoint";

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
        element: (
          <Box m={8}>
            <SearchInput endpoint={new IssueSearchEndpoint()} />
          </Box>
        ),
        loader: authCheckLoader,
      },
    ],
  },
]);
