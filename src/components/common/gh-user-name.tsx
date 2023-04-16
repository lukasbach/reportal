import React, { FC } from "react";
import { Avatar, Box, Text } from "@primer/react";
import { BoxProps } from "@primer/react/lib-esm/Box/Box";

export type GhUserNameProps = BoxProps & {
  login?: string;
  avatar?: string;
  avatarSize?: number;
};

export const GhUserName: FC<GhUserNameProps> = ({ login, avatar, avatarSize, ...boxProps }) => {
  if (!login) {
    return null;
  }

  return (
    <Box display="inline-flex" alignItems="baseline" {...boxProps}>
      {avatar && (
        <Box mr={1}>
          <Avatar src={avatar} size={avatarSize ?? 16} alt={login} />
        </Box>
      )}
      <Text>{login}</Text>
    </Box>
  );
};
