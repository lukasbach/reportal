import React, { FC, ReactNode, RefObject } from "react";
import { Box, IconButton, Text } from "@primer/react";
import { GrabberIcon, PencilIcon } from "@primer/octicons-react";

export type WidgetContainerProps = {
  children: ReactNode;
  title: string;
  icon: ReactNode;
  actionsRef: RefObject<HTMLDivElement>;
  onEdit: () => void;
};

export const WidgetContainer: FC<WidgetContainerProps> = ({ icon, children, onEdit, title, actionsRef }) => {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "border.default",
        borderRadius: "8px",
        bg: "canvas.subtle",
        boxShadow: "shadow.small",
        height: "100%",
        width: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        ":hover .icon": { display: "none" },
        " .grabicon": { display: "none" },
        " .action-item": { visibility: "hidden" },
        ":hover .grabicon": { display: "block" },
        ":hover .action-item": { visibility: "visible" },
        " .draghandle": { cursor: "grab" },
        " .draghandle:active": { cursor: "grabbing" },
      }}
    >
      <Box display="flex" my={1} mx={2} alignItems="center">
        <span className="icon draghandle">{icon}</span>
        <span className="grabicon draghandle">
          <GrabberIcon size={16} />
        </span>
        <Text ml={2} fontWeight="bold" fontSize={1} sx={{ flexGrow: 1 }} className="draghandle">
          {title}
        </Text>
        <div ref={actionsRef} className="action-item" />
        <IconButton aria-label="Edit Widget" icon={PencilIcon} size="small" className="action-item" onClick={onEdit} />
      </Box>
      <Box flexGrow={1} overflow="auto">
        {children}
      </Box>
    </Box>
  );
};
