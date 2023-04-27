import React, { FC } from "react";
import {
  BookIcon,
  CodeReviewIcon,
  CommentIcon,
  GitBranchIcon,
  GitPullRequestClosedIcon,
  GitPullRequestIcon,
  IssueClosedIcon,
  IssueOpenedIcon,
  PersonAddIcon,
  PersonIcon,
  PlusIcon,
  QuestionIcon,
  RepoForkedIcon,
  RepoIcon,
  RepoPushIcon,
  RocketIcon,
  SponsorTiersIcon,
  StarIcon,
  SyncIcon,
  TagIcon,
  TrashIcon,
} from "@primer/octicons-react";
import { Icon } from "@primer/octicons-react/dist/icons";
import { CellContentWithIcon } from "./cell-content-with-icon";

export type EventTypeDescriptorProps = { eventType: string; data: any };

const define = (text: string, icon?: Icon) => (
  <CellContentWithIcon text={text}>{(icon ?? QuestionIcon)({})}</CellContentWithIcon>
);

export const EventTypeDescriptor: FC<EventTypeDescriptorProps> = ({ eventType, data }) => {
  switch (eventType) {
    case "CommitCommentEvent":
      return define("Commented", CommentIcon);
    case "CreateEvent":
      if (data?.payload?.ref_type === "tag") {
        return define("Created Tag", TagIcon);
      }
      if (data?.payload?.ref_type === "branch") {
        return define("Created Branch", TagIcon);
      }
      if (data?.payload?.ref_type === "repository") {
        return define("Created Repo", RepoIcon);
      }
      return define("Created", PlusIcon);
    case "DeleteEvent":
      if (data?.payload?.ref_type === "tag") {
        return define("Deleted Tag", TagIcon);
      }
      if (data?.payload?.ref_type === "branch") {
        return define("Deleted Branch", GitBranchIcon);
      }
      if (data?.payload?.ref_type === "repository") {
        return define("Deleted Repo", RepoIcon);
      }
      return define("Deleted", TrashIcon);
    case "ForkEvent":
      return define(eventType, RepoForkedIcon);
    case "GollumEvent":
      return define(eventType, BookIcon);
    case "IssueCommentEvent":
      if (data?.payload?.action === "created") {
        return define("Commented Issue", CommentIcon);
      }
      if (data?.payload?.action === "edited") {
        return define("Edited Comment", CommentIcon);
      }
      if (data?.payload?.action === "deleted") {
        return define("Deleted Comment", CommentIcon);
      }
      return define(eventType, CommentIcon);
    case "IssuesEvent":
      if (data?.payload?.action === "opened") {
        return define("Opened Issue", IssueOpenedIcon);
      }
      if (data?.payload?.action === "edited") {
        return define("Edited Issue", IssueOpenedIcon);
      }
      if (data?.payload?.action === "closed") {
        return define("Closed Issue", IssueClosedIcon);
      }
      if (data?.payload?.action === "reopened") {
        return define("Reopened Issue", IssueOpenedIcon);
      }
      if (data?.payload?.action === "assigned") {
        return define("Assigned to Issue", PersonAddIcon);
      }
      if (data?.payload?.action === "unassigned") {
        return define("Unassigned from Issue", PersonIcon);
      }
      if (data?.payload?.action === "labeled") {
        return define("Labeled Issue", TagIcon);
      }
      if (data?.payload?.action === "unlabeled") {
        return define("Unlabeled Issue", TagIcon);
      }
      return define("Changed Issue", IssueOpenedIcon);
    case "MemberEvent":
      return define("Changed Collaborators", PersonAddIcon);
    case "PublicEvent":
      return define("Made public", RocketIcon);
    case "PullRequestEvent":
      if (data?.payload?.action === "opened") {
        return define("Opened PR", GitPullRequestIcon);
      }
      if (data?.payload?.action === "edited") {
        return define("Edited PR", GitPullRequestIcon);
      }
      if (data?.payload?.action === "closed") {
        return define("Closed PR", GitPullRequestClosedIcon);
      }
      if (data?.payload?.action === "reopened") {
        return define("Reopened PR", GitPullRequestIcon);
      }
      if (data?.payload?.action === "assigned") {
        return define("Assigned to PR", PersonAddIcon);
      }
      if (data?.payload?.action === "unassigned") {
        return define("Unassigned from PR", PersonIcon);
      }
      if (data?.payload?.action === "review_requested") {
        return define("Requested Review", GitPullRequestIcon);
      }
      if (data?.payload?.action === "review_request_removed") {
        return define("Removed Request for Review", GitPullRequestIcon);
      }
      if (data?.payload?.action === "labeled") {
        return define("Labeled PR", TagIcon);
      }
      if (data?.payload?.action === "unlabeled") {
        return define("Unlabeled PR", TagIcon);
      }
      if (data?.payload?.action === "synchronize") {
        return define("Synced PR", SyncIcon);
      }
      // TODO look into .action property
      return define("Changed PR", GitPullRequestIcon);
    case "PullRequestReviewEvent":
      return define("Reviewed", CodeReviewIcon);
    case "PullRequestReviewCommentEvent":
      return define("Commented on PR", CodeReviewIcon);
    case "PullRequestReviewThreadEvent":
      return define("Updated PR Thread", CodeReviewIcon);
    case "PushEvent":
      return define("Pushed", RepoPushIcon);
    case "ReleaseEvent":
      return define("Released", RocketIcon);
    case "SponsorshipEvent":
      return define("Sponsored", SponsorTiersIcon);
    case "WatchEvent":
      return define("Starred", StarIcon);
    default:
      return define(eventType, QuestionIcon);
  }
};
