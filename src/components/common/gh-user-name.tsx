import React, { FC } from "react";
import { Avatar, Box, Text } from "@primer/react";
import { BoxProps } from "@primer/react/lib-esm/Box/Box";

export type GhUserNameProps = BoxProps & {
  text?: string;
  avatar?: string;
  avatarSize?: number;
};

export const GhUserName: FC<GhUserNameProps> = ({ text, avatar, avatarSize, ...boxProps }) => {
  if (!text) {
    return null;
  }

  return (
    <Box display="inline-flex" alignItems="baseline" {...boxProps}>
      {avatar && (
        <Box mr={1} minWidth="fit-content">
          <Avatar src={avatar} size={avatarSize ?? 16} alt={text} />
        </Box>
      )}
      <Text>{text}</Text>
    </Box>
  );
};
