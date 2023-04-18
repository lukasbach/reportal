import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router";
import { BaseStyles } from "@primer/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { router } from "./router";
import { DetailsProvider } from "./components/details/details-provider";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "react-modern-drawer/dist/index.css";
import { ThemeWrapper } from "./components/common/theme/theme-wrapper";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <DndProvider backend={HTML5Backend}>
    <QueryClientProvider client={queryClient}>
      <ThemeWrapper>
        <BaseStyles bg="canvas.default">
          <RouterProvider router={router} />
          <DetailsProvider />
        </BaseStyles>
      </ThemeWrapper>
    </QueryClientProvider>
  </DndProvider>
  // </React.StrictMode>
);
