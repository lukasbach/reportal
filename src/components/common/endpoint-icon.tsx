import React, { FC } from "react";
import { InboxIcon, IssueOpenedIcon, RssIcon } from "@primer/octicons-react";

export type EndpointIconProps = {
  endpointId: string;
  size?: number;
};

export const EndpointIcon: FC<EndpointIconProps> = ({ endpointId, size }) => {
  if (endpointId === "issues") {
    return <IssueOpenedIcon size={size} />;
  }

  if (endpointId === "notifications") {
    return <InboxIcon size={size} />;
  }

  if (endpointId === "events") {
    return <RssIcon size={size} />;
  }

  return null;
};
