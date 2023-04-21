import React, { FC, ReactNode } from "react";
import { Box } from "@primer/react";

export type CustomRiverProps = {
  children: ReactNode;
  img: string;
  height: string;
  invert?: boolean;
};

export const CustomRiver: FC<CustomRiverProps> = ({ img, children, height, invert }) => {
  return (
    <Box
      display="flex"
      height={height}
      justifyContent="space-between"
      alignItems="center"
      mt={80}
      flexDirection={invert ? "row-reverse" : "row"}
    >
      <Box width="40%" pr={invert ? 120 : 0} pl={!invert ? 120 : 0}>
        {children}
      </Box>
      <Box position="relative" width="55%" height={height}>
        <Box
          position="absolute"
          width="2000px"
          top={0}
          left={invert ? undefined : 0}
          right={invert ? 0 : undefined}
          display="flex"
          justifyContent={invert ? "flex-end" : "flex-start"}
          zIndex={999}
        >
          <Box as="img" src={img} height={height} borderRadius="16px" border="2px solid white" />
        </Box>
      </Box>
    </Box>
  );
};
