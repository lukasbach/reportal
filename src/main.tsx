import React from "react";
import ReactDOM from "react-dom/client";

import { initializeApp } from "firebase/app";
import { RouterProvider } from "react-router";
import { BaseStyles, ThemeProvider } from "@primer/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { router } from "./router";
import { setupAuthCallback } from "./auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyDoZH7_ayqubAq909vnrlzMCqGnDkj1sNc",
  authDomain: "hellogh.firebaseapp.com",
  projectId: "hellogh",
  storageBucket: "hellogh.appspot.com",
  messagingSenderId: "526679845036",
  appId: "1:526679845036:web:bca007b24e61289d3d5709",
});

setupAuthCallback();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <DndProvider backend={HTML5Backend}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BaseStyles>
          <RouterProvider router={router} />
        </BaseStyles>
      </ThemeProvider>
    </QueryClientProvider>
  </DndProvider>
  // </React.StrictMode>
);
