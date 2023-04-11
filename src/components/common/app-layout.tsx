import React, { FC } from "react";
import { Outlet } from "react-router";
import { Avatar, Box, Header } from "@primer/react";

export const AppLayout: FC = () => {
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Header>
        <Header.Item>
          <Header.Link href="#">
            <span>GitHub</span>
          </Header.Link>
        </Header.Item>
        <Header.Item full>Menu</Header.Item>
        <Header.Item>
          <Avatar src="https://github.com/octocat.png" size={20} square alt="@octocat" />
        </Header.Item>
      </Header>
      <Box flexGrow={1} overflow="auto">
        <Outlet />
      </Box>
    </Box>
  );
};
