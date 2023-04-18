import React, { FC, ReactNode } from "react";
import { Box, Button, IconButton, Link, StateLabel, Text, Timeline } from "@primer/react";
import { CommentIcon, KebabHorizontalIcon, XIcon } from "@primer/octicons-react";
import { DetailsState } from "./types";
import { useIssueData } from "./use-issue-data";
import { GhUserName } from "../common/gh-user-name";
import { IssueDetailsComment } from "./issue-details-comment";
import { isNotNullish } from "../../utils";
import { IssueOrPullRequest } from "../../gql/graphql";
import { IssueDetailsStatusBadge } from "./issue-details-status-badge";
import { useDetailsStore } from "./use-details-store";
import { LoadingEmptyState } from "../common/empty-states/loading-empty-state";

export type IssueDetailsProps = {
  issueProps: DetailsState & { type: "issue" };
};

export const IssueDetails: FC<IssueDetailsProps> = ({ issueProps }) => {
  const close = useDetailsStore(({ close }) => close);
  const { data } = useIssueData(issueProps.repo, issueProps.owner, issueProps.issue, issueProps.isPr);
  const issue: IssueOrPullRequest = (data as any)?.repository?.issue ?? (data as any)?.repository?.pullRequest;
  if (!issue) {
    return <LoadingEmptyState />;
  }

  return (
    <>
      <Box p={4} display="flex" borderBottom="1px solid" borderColor="border.default">
        <Box flexGrow={1}>
          <Text as="p" m={0} fontSize={1} color="fg.muted">
            <Link
              href={`https://github.com/${issueProps.owner}/${issueProps.repo}`}
              target="_blank"
              sx={{ color: "unset" }}
            >
              {issueProps.owner}/{issueProps.repo}
            </Link>
            #
            <Link href={issue.url} target="_blank" sx={{ color: "unset" }}>
              {issueProps.issue}
            </Link>
          </Text>
          <Link href={issue.url} target="_blank" className="unstyled-link" sx={{ color: "unset" }}>
            <Text as="h1" m={0} fontSize={2}>
              {issue.title}
            </Text>
          </Link>
          <Box display="flex" alignItems="center">
            <IssueDetailsStatusBadge issue={issue} />
            <Text m={0} ml={2} fontSize={1} color="fg.muted">
              {issue?.assignees?.nodes?.length === 0 && <>No one</>}
              <GhUserName
                login={issue?.assignees?.nodes?.[0]?.login}
                avatar={issue?.assignees?.nodes?.[0]?.avatarUrl}
              />{" "}
              {(issue?.assignees?.nodes?.length ?? 0) > 1 && `and ${(issue?.assignees?.nodes?.length ?? 0) - 1} more`}{" "}
              assigned - {issue.comments.totalCount} comments
            </Text>
          </Box>
        </Box>
        <Box>
          <IconButton icon={XIcon} onClick={close} aria-label="Close" />
        </Box>
      </Box>
      <Box bg="canvas.subtle" flexGrow={1}>
        <IssueDetailsComment comment={issue as any} />
        {issue.comments.totalCount > 50 && (
          <Timeline sx={{ ml: 6 }}>
            <Timeline.Item>
              <Timeline.Badge>
                <KebabHorizontalIcon />
              </Timeline.Badge>
              <Timeline.Body>
                <Link href={issue.url} target="_blank" sx={{ fontWeight: "bold", color: "fg.default", mr: 1 }} muted>
                  {issue.comments.totalCount - 50} more comments on GitHub
                </Link>
              </Timeline.Body>
            </Timeline.Item>
          </Timeline>
        )}
        {issue.comments.nodes?.filter(isNotNullish).map((comment) => (
          <IssueDetailsComment key={comment.id} comment={comment as any} />
        ))}
        <Timeline sx={{ ml: 6 }}>
          <Timeline.Item>
            <Timeline.Badge>
              <CommentIcon />
            </Timeline.Badge>
            <Timeline.Body>
              <Link href={issue.url} target="_blank" sx={{ fontWeight: "bold", color: "fg.default", mr: 1 }} muted>
                Open on GitHub to comment
              </Link>
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </Box>
    </>
  );
};
