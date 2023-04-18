import React, { FC } from "react";
import Drawer from "react-modern-drawer";
import { Box } from "@primer/react";
import { useDetailsStore } from "./use-details-store";
import { IssueDetails } from "./issue-details";

export const DetailsProvider: FC = () => {
  const details = useDetailsStore(({ state }) => state);
  const close = useDetailsStore(({ close }) => close);
  return (
    <Drawer open={details.type !== "unset"} onClose={close} direction="right" duration={100} size={800}>
      <Box overflow="auto" height="100%" bg="canvas.default" display="flex" flexDirection="column">
        {details.type === "issue" && <IssueDetails issueProps={details} />}
      </Box>
    </Drawer>
  );
};
