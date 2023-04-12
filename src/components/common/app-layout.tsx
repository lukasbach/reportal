import React, { FC } from "react";
import { Outlet } from "react-router";
import { Avatar, Box, Header } from "@primer/react";

export const AppLayout: FC = () => {
  return (
    <Box display="flex" height="100%">
      <Box width="240px" bg="canvas.inset" borderColor="border.default" borderWidth="1px" borderStyle="solid">
        Hello
      </Box>
      <Box flexGrow={1} overflow="auto">
        <Outlet />
      </Box>
    </Box>
  );
};
