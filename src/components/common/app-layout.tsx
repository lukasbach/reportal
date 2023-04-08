import React, { FC, ReactNode } from "react";
import { Outlet } from "react-router";

export const AppLayout: FC = () => {
  return (
    <>
      hello
      <Outlet />
    </>
  );
};
