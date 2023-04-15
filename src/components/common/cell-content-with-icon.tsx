import React, { FC, ReactNode } from "react";
import { Box } from "@primer/react";

export type CellContentWithIconProps = {
  children: ReactNode;
  text: string;
};

export const CellContentWithIcon: FC<CellContentWithIconProps> = ({ text, children }) => {
  return (
    <Box display="flex" alignItems="center">
      <Box mr={1}>{children}</Box>
      <Box sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{text}</Box>
    </Box>
  );
};
