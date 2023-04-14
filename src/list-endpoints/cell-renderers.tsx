import { Avatar, Box, RelativeTime, Text } from "@primer/react";
import { IssueClosedIcon, IssueOpenedIcon } from "@primer/octicons-react";
import React from "react";
import { ResponseField } from "./types";

export const cellRenderers = {
  issueTitle: () => (value, data) =>
    (
      <Box display="flex" alignItems="center">
        <Box mr={1}>
          {data.state.toLocaleLowerCase() === "open" ? (
            <IssueOpenedIcon size={16} fill="fg.muted" />
          ) : (
            <IssueClosedIcon size={16} fill="done.fg" />
          )}
        </Box>
        <Box sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{value}</Box>
      </Box>
    ),
  date: () => (value) => <RelativeTime datetime={value} />,
  author: (personField: string, avatarField: string) => (value, data) =>
    (
      <Box display="flex" alignItems="center">
        <Box mr={1}>
          <Avatar src={data[personField][avatarField]} size={16} square alt={value} />
        </Box>
        <Text>{value}</Text>
      </Box>
    ),
} satisfies Record<string, (...args: any[]) => ResponseField["renderCell"]>;
