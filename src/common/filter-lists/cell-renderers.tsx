import { RelativeTime } from "@primer/react";
import React from "react";
import byteSize from "byte-size";
import { CheckCircleFillIcon } from "@primer/octicons-react";
import { ListField } from "./types";
import { IssueStateIcon } from "../../components/common/issue-state-icon";
import { CellContentWithIcon } from "../../components/common/cell-content-with-icon";
import { EventTypeDescriptor } from "../../components/common/event-type-descriptor";
import { GhUserName } from "../../components/common/gh-user-name";
import { resolveRecursiveSubitem } from "../../utils";

export const cellRenderers = {
  issueTitle: () => (value, data) =>
    (
      <CellContentWithIcon text={value}>
        <IssueStateIcon state={data.state} isPr={data.url?.includes("pull")} />
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
  author: (key: string, userField: string, avatarField: string) => (value, data) =>
    (
      <GhUserName
        text={resolveRecursiveSubitem(data, key)?.[userField]}
        avatar={resolveRecursiveSubitem(data, key)?.[avatarField]}
      />
    ),
  diskUsage: () => (str) => {
    const { value, unit } = byteSize(parseInt(str, 10) * 1024);
    return (
      <>
        {value}
        {unit}
      </>
    );
  },
  boolean: () => (value) => value ? <CheckCircleFillIcon size={16} /> : <span />,
} satisfies Record<string, (...args: any[]) => ListField["renderCell"]>;
