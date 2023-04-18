import React, { FC } from "react";
import { Button } from "@primer/react";
import { useLogin } from "../../auth/hooks";

export type HomePageProps = {};

export const HomePage: FC<HomePageProps> = () => {
  const { signIn } = useLogin();
  return <Button onClick={signIn}>Login</Button>;
};
