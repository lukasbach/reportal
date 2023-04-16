import { Avatar, Box, RelativeTime, Text } from "@primer/react";
import React from "react";
import { ResponseField } from "./types";
import { IssueStateIcon } from "../../components/common/issue-state-icon";
import { CellContentWithIcon } from "../../components/common/cell-content-with-icon";
import { EventTypeDescriptor } from "../../components/common/event-type-descriptor";
import { GhUserName } from "../../components/common/gh-user-name";

export const cellRenderers = {
  issueTitle: () => (value, data) =>
    (
      <CellContentWithIcon text={value}>
        <IssueStateIcon state={value} isPr={data.url?.includes("pull")} />
      </CellContentWithIcon>
    ),
  issueState: () => (value, data) =>
    (
      <CellContentWithIcon text={value[0] + value.toLowerCase().slice(1)}>
        <IssueStateIcon state={value} isPr={data.url?.includes("pull")} />
      </CellContentWithIcon>
    ),
  eventType: () => (value, data) => <EventTypeDescriptor eventType={value} data={data} />,
  date: () => (value) => <RelativeTime datetime={value} />,
  author: (personField: string, avatarField: string) => (value, data) =>
    <GhUserName login={value} avatar={data[personField][avatarField]} />,
} satisfies Record<string, (...args: any[]) => ResponseField["renderCell"]>;
