import React, { FC } from "react";
import {
  GitMergeIcon,
  GitPullRequestClosedIcon,
  GitPullRequestIcon,
  IssueClosedIcon,
  IssueOpenedIcon,
  QuestionIcon,
} from "@primer/octicons-react";
import { useTheme } from "@primer/react";

export type IssueStateIconProps = {
  state: string;
  isPr?: boolean;
};

export const IssueStateIcon: FC<IssueStateIconProps> = ({ state, isPr }) => {
  const { theme } = useTheme();
  if (isPr) {
    switch (state?.toLowerCase()) {
      case "open":
        return <GitPullRequestIcon size={16} fill={theme?.colors.open.emphasis} />;
      case "closed":
        return <GitPullRequestClosedIcon size={16} fill={theme?.colors.closed.emphasis} />;
      case "merged":
        return <GitMergeIcon size={16} fill={theme?.colors.done.emphasis} />;
      default:
        return <QuestionIcon size={16} />;
    }
  }
  switch (state?.toLowerCase()) {
    case "open":
      return <IssueOpenedIcon size={16} fill={theme?.colors.open.emphasis} />;
    case "closed":
      return <IssueClosedIcon size={16} fill={theme?.colors.done.emphasis} />;
    default:
      return <QuestionIcon size={16} fill="fg.muted" />;
  }
};
