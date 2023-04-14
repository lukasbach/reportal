import React, { FC, ReactNode } from "react";
import { Box, Button, IconButton, Text } from "@primer/react";
import { GrabberIcon, PencilIcon } from "@primer/octicons-react";

export type WidgetContainerProps = {
  children: ReactNode;
  title: string;
  icon: ReactNode;
};

export const WidgetContainer: FC<WidgetContainerProps> = ({ icon, children, title }) => {
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
        ":hover .icon": { display: "none" },
        " .grabicon": { display: "none" },
        ":hover .grabicon": { display: "block" },
        ":hover .edit-btn": { visibility: "visible" },
      }}
    >
      <Box
        display="flex"
        my={1}
        mx={2}
        alignItems="center"
        className="draghandle"
        sx={{
          cursor: "grab",
          ":active": { cursor: "grabbing" },
        }}
      >
        <span className="icon">{icon}</span>
        <span className="grabicon">
          <GrabberIcon size={16} />
        </span>
        <Text ml={2} fontWeight="bold" fontSize={1} sx={{ flexGrow: 1 }}>
          {title}
        </Text>
        <IconButton
          aria-label="Edit Widget"
          icon={PencilIcon}
          size="small"
          className="edit-btn"
          sx={{ visibility: "hidden" }}
        />
      </Box>
      {children}
    </Box>
  );
};
