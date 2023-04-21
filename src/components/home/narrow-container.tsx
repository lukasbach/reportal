import React, { FC, ReactNode } from "react";
import { Box } from "@primer/react";

export type NarrowContainerProps = {
  children: ReactNode;
};

export const NarrowContainer: FC<NarrowContainerProps> = ({ children }) => {
  return (
    <Box maxWidth="1200px" mx="auto" px="40px">
      {children}
    </Box>
  );
};
