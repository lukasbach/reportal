import React, { FC } from "react";
import Drawer from "react-modern-drawer";
import { useDetailsStore } from "./use-details-store";
import { IssueDetails } from "./issue-details";

export const DetailsProvider: FC = () => {
  const details = useDetailsStore(({ state }) => state);
  const close = useDetailsStore(({ close }) => close);
  return (
    <Drawer
      open={details.type !== "unset"}
      onClose={close}
      direction="right"
      duration={100}
      size={800}
      style={{ overflow: "auto" }}
    >
      {details.type === "issue" && <IssueDetails issueProps={details} />}
    </Drawer>
  );
};
