import React, { FC, useMemo } from "react";
import { Box, TextInput } from "@primer/react";

export type RepoInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export const RepoInput: FC<RepoInputProps> = ({ onChange, value }) => {
  const [user, repo] = useMemo(() => value.split("/", 2), [value]);

  return (
    <Box width="100%" display="flex" justifyContent="space-between">
      <TextInput
        leadingVisual="User"
        sx={{ width: "40%" }}
        value={user}
        onChange={(e) => {
          onChange(`${e.target.value}/${repo}`);
        }}
      />
      <TextInput
        leadingVisual="Repo"
        sx={{ width: "58%" }}
        value={repo}
        onChange={(e) => {
          onChange(`${user}/${e.target.value}`);
        }}
      />
    </Box>
  );
};
