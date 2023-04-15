import React, { FC } from "react";
import {
  BookIcon,
  CodeReviewIcon,
  CommentIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  IssueOpenedIcon,
  PersonAddIcon,
  PlusIcon,
  QuestionIcon,
  RepoForkedIcon,
  RepoIcon,
  RepoPushIcon,
  RocketIcon,
  SponsorTiersIcon,
  StarIcon,
  TagIcon,
  TrashIcon,
} from "@primer/octicons-react";
import { CellContentWithIcon } from "./cell-content-with-icon";

export type EventTypeDescriptorProps = { eventType: string; data: any };

export const EventTypeDescriptor: FC<EventTypeDescriptorProps> = ({ eventType, data }) => {
  switch (eventType) {
    case "CommitCommentEvent":
      return (
        <CellContentWithIcon text="Commented">
          <CommentIcon size={16} />
        </CellContentWithIcon>
      );
    case "CreateEvent":
      if (data?.payload?.ref_type === "tag") {
        return (
          <CellContentWithIcon text="Created Tag">
            <TagIcon size={16} />
          </CellContentWithIcon>
        );
      }
      if (data?.payload?.ref_type === "branch") {
        return (
          <CellContentWithIcon text="Created Branch">
            <TagIcon size={16} />
          </CellContentWithIcon>
        );
      }
      if (data?.payload?.ref_type === "repository") {
        return (
          <CellContentWithIcon text="Created Repo">
            <RepoIcon size={16} />
          </CellContentWithIcon>
        );
      }
      return (
        <CellContentWithIcon text="Created">
          <PlusIcon size={16} />
        </CellContentWithIcon>
      );
    case "DeleteEvent":
      if (data?.payload?.ref_type === "tag") {
        return (
          <CellContentWithIcon text="Deleted Tag">
            <TagIcon size={16} />
          </CellContentWithIcon>
        );
      }
      if (data?.payload?.ref_type === "branch") {
        return (
          <CellContentWithIcon text="Deleted Branch">
            <GitBranchIcon size={16} />
          </CellContentWithIcon>
        );
      }
      if (data?.payload?.ref_type === "repository") {
        return (
          <CellContentWithIcon text="Deleted Repo">
            <RepoIcon size={16} />
          </CellContentWithIcon>
        );
      }
      return (
        <CellContentWithIcon text="Deleted">
          <TrashIcon size={16} />
        </CellContentWithIcon>
      );
    case "ForkEvent":
      return (
        <CellContentWithIcon text={eventType}>
          <RepoForkedIcon size={16} />
        </CellContentWithIcon>
      );
    case "GollumEvent":
      return (
        <CellContentWithIcon text={eventType}>
          <BookIcon size={16} />
        </CellContentWithIcon>
      );
    case "IssueCommentEvent":
      return (
        <CellContentWithIcon text={eventType}>
          <CommentIcon size={16} />
        </CellContentWithIcon>
      );
    case "IssuesEvent":
      // TODO look into .action property
      return (
        <CellContentWithIcon text="Changed Issue">
          <IssueOpenedIcon size={16} />
        </CellContentWithIcon>
      );
    case "MemberEvent":
      return (
        <CellContentWithIcon text="Changed Collaborators">
          <PersonAddIcon size={16} />
        </CellContentWithIcon>
      );
    case "PublicEvent":
      return (
        <CellContentWithIcon text="Made public">
          <RocketIcon size={16} />
        </CellContentWithIcon>
      );
    case "PullRequestEvent":
      // TODO look into .action property
      return (
        <CellContentWithIcon text="Changed PR">
          <GitPullRequestIcon size={16} />
        </CellContentWithIcon>
      );
    case "PullRequestReviewEvent":
      return (
        <CellContentWithIcon text="Reviewed">
          <CodeReviewIcon size={16} />
        </CellContentWithIcon>
      );
    case "PullRequestReviewCommentEvent":
      return (
        <CellContentWithIcon text="Commented on PR">
          <CodeReviewIcon size={16} />
        </CellContentWithIcon>
      );
    case "PullRequestReviewThreadEvent":
      return (
        <CellContentWithIcon text="Updated PR Thread">
          <CodeReviewIcon size={16} />
        </CellContentWithIcon>
      );
    case "PushEvent":
      return (
        <CellContentWithIcon text="Pushed">
          <RepoPushIcon size={16} />
        </CellContentWithIcon>
      );
    case "ReleaseEvent":
      return (
        <CellContentWithIcon text="Released">
          <RocketIcon size={16} />
        </CellContentWithIcon>
      );
    case "SponsorshipEvent":
      return (
        <CellContentWithIcon text="Sponsored">
          <SponsorTiersIcon size={16} />
        </CellContentWithIcon>
      );
    case "WatchEvent":
      return (
        <CellContentWithIcon text="Starred">
          <StarIcon size={16} />
        </CellContentWithIcon>
      );
    default:
      return (
        <CellContentWithIcon text={eventType}>
          <QuestionIcon size={16} />
        </CellContentWithIcon>
      );
  }
};
