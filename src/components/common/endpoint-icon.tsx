import React, { FC } from "react";
import { InboxIcon, IssueOpenedIcon, RepoIcon, RssIcon } from "@primer/octicons-react";
import { EndpointId } from "../../list-endpoints/endpoints";

export type EndpointIconProps = {
  endpointId: string | null;
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

  if (endpointId === EndpointId.Repos) {
    return <RepoIcon size={size} />;
  }

  return null;
};
