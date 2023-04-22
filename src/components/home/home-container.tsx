import React, { FC, ReactNode } from "react";
import { ThemeProvider } from "@primer/react-brand";
import { Box } from "@primer/react";
import mySvg from "../../assets/bg.svg";

export type HomeContainerProps = {
  children: ReactNode;
};

export const HomeContainer: FC<HomeContainerProps> = ({ children }) => {
  return (
    <ThemeProvider colorMode="dark" style={{ height: "100%" }}>
      <Box
        style={{ backgroundImage: `url(${mySvg})`, backgroundRepeat: "no-repeat" }}
        minHeight="100%"
        bg="#080a0e"
        overflowX="hidden"
      >
        {children}
      </Box>
    </ThemeProvider>
  );
};
