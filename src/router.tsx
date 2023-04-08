import { createHashRouter } from "react-router-dom";
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
          <div>
            <SearchInput endpoint={new IssueSearchEndpoint()} />
          </div>
        ),
        loader: authCheckLoader,
      },
    ],
  },
]);
