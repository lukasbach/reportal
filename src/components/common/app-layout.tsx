import React, { FC } from "react";
import { Outlet } from "react-router";
import { Box } from "@primer/react";
import { Sidebar } from "./sidebar";
import { DetailsProvider } from "../details/details-provider";

export const AppLayout: FC = () => {
  return (
    <Box display="flex" height="100%">
      <Box
        width="240px"
        minWidth="240px"
        maxWidth="240px"
        bg="canvas.inset"
        borderColor="border.default"
        borderWidth="1px"
        borderStyle="solid"
        maxHeight="100%"
        overflow="auto"
      >
        <Sidebar />
      </Box>
      <Box flexGrow={1} overflow="auto">
        <DetailsProvider />
        <Outlet />
      </Box>
    </Box>
  );
};
