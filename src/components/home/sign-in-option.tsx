import React, { FC } from "react";
import { Box } from "@primer/react";

export type SignInOptionProps = {
  title: string;
  description: string;
  onClick?: () => void;
  icon: JSX.Element;
};

export const SignInOption: FC<SignInOptionProps> = ({ icon, description, title, onClick }) => {
  return (
    <Box
      as="button"
      onClick={onClick}
      display="flex"
      width="100%"
      textAlign="left"
      px={4}
      py={4}
      border="1px solid"
      borderColor="border.muted"
      borderRadius={16}
      bg="transparent"
      my={4}
      alignItems="center"
      sx={{
        cursor: "pointer",
        ":hover": {
          borderColor: "border.default",
          bg: "canvas.inset",
        },
        ":focus": {
          outline: "1px solid",
          outlineColor: "border.default",
        },
      }}
    >
      <Box mr={3}>{icon}</Box>
      <Box>
        <Box as="h2">{title}</Box>
        <Box as="p">{description}</Box>
      </Box>
    </Box>
  );
};
