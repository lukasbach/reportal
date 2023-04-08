import React, { FC } from "react";
import { Button } from "@primer/react";
import { login } from "../../auth";

export type HomePageProps = {};

export const HomePage: FC<HomePageProps> = () => {
  return <Button onClick={login}>Login</Button>;
};
