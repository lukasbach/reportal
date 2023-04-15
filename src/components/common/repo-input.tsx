import React, { FC, useMemo } from "react";
import { Box, TextInput } from "@primer/react";
import { useStableHandler } from "../../utils";

export type RepoInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export const RepoInput: FC<RepoInputProps> = ({ onChange, value }) => {
  const [user, repo] = useMemo(() => value.split("/", 2), [value]);

  const applyChange = useStableHandler((newUser: string, newRepo: string) => {
    if (newUser.includes("/")) {
      const [newUser2, newRepo2] = newUser.split("/", 2);
      onChange(`${newUser2}/${newRepo2}`);
    } else if (newRepo.includes("/")) {
      const [newUser2, newRepo2] = newRepo.split("/", 2);
      onChange(`${newUser2}/${newRepo2}`);
    } else {
      onChange(`${newUser}/${newRepo}`);
    }
  });

  return (
    <Box width="100%" display="flex" justifyContent="space-between">
      <TextInput
        leadingVisual="User"
        sx={{ width: "40%" }}
        value={user}
        onChange={(e) => {
          applyChange(e.target.value, repo);
        }}
      />
      <TextInput
        leadingVisual="Repo"
        sx={{ width: "58%" }}
        value={repo}
        onChange={(e) => {
          applyChange(user, e.target.value);
        }}
      />
    </Box>
  );
};
