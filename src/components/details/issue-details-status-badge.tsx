import React, { FC } from "react";
import { StateLabel } from "@primer/react";
import {
  Issue,
  IssueOrPullRequest,
  IssueState,
  IssueStateReason,
  PullRequest,
  PullRequestState,
} from "../../gql/graphql";

export type IssueDetailsStatusBadgeProps = {
  issue: IssueOrPullRequest;
};

export const IssueDetailsStatusBadge: FC<IssueDetailsStatusBadgeProps> = ({ issue }) => {
  if ((issue as PullRequest).isDraft) {
    return (
      <StateLabel variant="small" status="draft">
        Draft
      </StateLabel>
    );
  }

  if (issue.state === IssueState.Open) {
    return (
      <StateLabel variant="small" status="issueOpened">
        Open
      </StateLabel>
    );
  }

  if ((issue as Issue).stateReason === IssueStateReason.NotPlanned) {
    return (
      <StateLabel variant="small" status="issueClosedNotPlanned">
        Closed
      </StateLabel>
    );
  }

  if (issue.state === IssueState.Closed) {
    return (
      <StateLabel variant="small" status="issueClosed">
        Closed
      </StateLabel>
    );
  }

  if (issue.state === PullRequestState.Open) {
    return (
      <StateLabel variant="small" status="pullOpened">
        Open
      </StateLabel>
    );
  }

  if (issue.state === PullRequestState.Closed) {
    return (
      <StateLabel variant="small" status="pullClosed">
        Closed
      </StateLabel>
    );
  }

  if (issue.state === PullRequestState.Merged) {
    return (
      <StateLabel variant="small" status="pullMerged">
        Merged
      </StateLabel>
    );
  }

  return null;
};
