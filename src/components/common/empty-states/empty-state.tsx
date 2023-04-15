import React, { FC, ReactNode } from "react";
import { Box, Text } from "@primer/react";

export type EmptyStateProps = {
  title?: string;
  text?: string;
  children: ReactNode;
};

export const EmptyState: FC<EmptyStateProps> = ({ children, title, text }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      p={4}
      textAlign="center"
    >
      {title && (
        <Text as="h3" fontSize={3} m={0}>
          {title}
        </Text>
      )}
      {text && (
        <Text as="p" fontSize={2}>
          {text}
        </Text>
      )}

      <Box>{children}</Box>
    </Box>
  );
};
