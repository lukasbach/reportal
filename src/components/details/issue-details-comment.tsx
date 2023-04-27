import React, { FC, useEffect, useRef } from "react";
import { Box, RelativeTime, Text, Token } from "@primer/react";
import { MarkdownViewer } from "@primer/react/drafts";
import { IssueComment } from "../../gql/graphql";
import { GhUserName } from "../common/gh-user-name";
import { useDetailsStore } from "./use-details-store";

export type IssueDetailsCommentProps = {
  comment: IssueComment;
};

const reactions = {
  THUMBS_UP: "👍",
  THUMBS_DOWN: "👎",
  LAUGH: "😄",
  HOORAY: "🎉",
  CONFUSED: "😕",
  HEART: "❤️",
  ROCKET: "🚀",
  EYES: "👀",
};

export const IssueDetailsComment: FC<IssueDetailsCommentProps> = ({ comment }) => {
  const highlightedComment = useDetailsStore(({ state }) => (state.type === "issue" ? state.comment : undefined));
  const boxRef = useRef<HTMLDivElement | null>(null);
  const isHighlighted = highlightedComment === comment.id;
  console.log("isHighlighted", isHighlighted, highlightedComment, comment);

  useEffect(() => {
    if (isHighlighted) {
      boxRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isHighlighted]);

  return (
    <Box
      sx={{
        borderRadius: "8px",
        border: "1px solid",
        borderColor: isHighlighted ? "accent.emphasis" : "border.default",
        m: 2,
        overflowX: "auto",
      }}
      ref={boxRef}
    >
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "border.default",
          bg: "canvas.inset",
          p: 1,
          pl: 2,
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          fontSize: 1,
        }}
      >
        <GhUserName text={comment.author?.login} avatar={comment.author?.avatarUrl} avatarSize={20} fontWeight="bold" />{" "}
        <Text color="fg.muted">
          commented <RelativeTime datetime={comment.createdAt} />
        </Text>
      </Box>
      <Box sx={{ px: 2, pb: 2, fontSize: 1, overflowX: "auto", bg: "canvas.default" }}>
        <MarkdownViewer dangerousRenderedHTML={{ __html: comment.bodyHTML }} />
        {comment.reactionGroups
          ?.filter((reaction) => reaction.reactors?.totalCount > 0)
          .map((reaction) => (
            <Token
              sx={{ mr: 2, mt: 2 }}
              text={`${reactions[reaction.content.toUpperCase()]} ${reaction.reactors?.totalCount}`}
            />
          ))}
      </Box>
    </Box>
  );
};
