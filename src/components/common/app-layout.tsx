import React, { FC } from "react";
import { Outlet } from "react-router";
import { Avatar, Header } from "@primer/react";

export const AppLayout: FC = () => {
  return (
    <>
      <Header>
        <Header.Item>
          <Header.Link href="#" fontSize={2}>
            <span>GitHub</span>
          </Header.Link>
        </Header.Item>
        <Header.Item full>Menu</Header.Item>
        <Header.Item mr={0}>
          <Avatar src="https://github.com/octocat.png" size={20} square alt="@octocat" />
        </Header.Item>
      </Header>
      <Outlet />
    </>
  );
};
