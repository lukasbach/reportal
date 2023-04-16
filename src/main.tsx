import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router";
import { BaseStyles, ThemeProvider } from "@primer/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { router } from "./router";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "react-modern-drawer/dist/index.css";
import { DetailsProvider } from "./components/details/details-provider";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <DndProvider backend={HTML5Backend}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BaseStyles>
          <RouterProvider router={router} />
          <DetailsProvider />
        </BaseStyles>
      </ThemeProvider>
    </QueryClientProvider>
  </DndProvider>
  // </React.StrictMode>
);
