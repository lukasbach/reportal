import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router";
import { BaseStyles } from "@primer/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { router } from "./router";
import { ThemeWrapper } from "./components/common/theme/theme-wrapper";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "react-modern-drawer/dist/index.css";
import "@primer/react-brand/lib/css/main.css";

const queryClient = new QueryClient();

// TODO recolor resize handle in widget corner for dark mode

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <DndProvider backend={HTML5Backend}>
    <QueryClientProvider client={queryClient}>
      <ThemeWrapper>
        <BaseStyles bg="canvas.default">
          <RouterProvider router={router} />
        </BaseStyles>
      </ThemeWrapper>
    </QueryClientProvider>
  </DndProvider>
  // </React.StrictMode>
);
