import React, { FC, useRef } from "react";
import { Box, Button, ButtonGroup, Text } from "@primer/react";
import { PinIcon } from "@primer/octicons-react";
import { Link } from "react-router-dom";
import { useConfirm, usePrompt } from "../../../dialogs";

export type FilterListItemProps = {
  top: string;
  bottom: string;
  icon: JSX.Element;

  name: string;
  itemLabel: string;
  onDelete?: () => void;
  onRename?: (newName: string) => void;
  setPinned?: (pin: boolean) => void;

  pinned?: boolean;

  href: string;
};

export const OverviewListItem: FC<FilterListItemProps> = ({
  top,
  bottom,
  icon,
  name,
  itemLabel,
  onDelete,
  onRename,
  pinned,
  setPinned,
  href,
}) => {
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  const { dialog: deleteDialog, confirm: confirmDelete } = useConfirm(
    `Delete ${itemLabel}?`,
    `Are you sure you want to delete this ${itemLabel}?`,
    "Delete",
    "No",
    true
  );
  const { dialog: renameDialog, prompt: promptRename } = usePrompt(
    `Rename ${itemLabel}`,
    `${itemLabel} name`,
    "New name"
  );

  return (
    <>
      {deleteDialog}
      {renameDialog}
      <Box
        display="flex"
        alignItems="center"
        px={3}
        py={2}
        borderColor="border.default"
        borderWidth="1px"
        borderStyle="solid"
        borderRadius="8px"
        boxShadow="shadow.small"
        lineHeight="1.2rem"
        mb={2}
        sx={{
          cursor: "pointer",
          ":hover": {
            bg: "canvas.subtle",
          },
          ":hover .actions": {
            display: "flex",
          },
          ":hover .pin": {
            display: "none",
          },
          ":active": {
            bg: "canvas.inset",
          },
        }}
        onClick={(e) => {
          if (!linkRef.current?.contains(e.target as any)) {
            linkRef.current?.click?.();
          }
        }}
      >
        <Box mr={3}>{icon}</Box>
        <Box flexGrow={1}>
          <Text fontSize="1" color="fg.muted">
            {top}
          </Text>
          <Link to={href} className="unstyled-link" ref={linkRef}>
            <Box fontSize="3" color="fg.default" sx={{ textDecoration: "none" }}>
              {name}
            </Box>
          </Link>
          <Box fontSize="1" color="fg.muted">
            {bottom}
          </Box>
        </Box>
        <Box className="pin">{pinned && <PinIcon size={16} />}</Box>
        <Box
          onClick={(e) => {
            e.stopPropagation();
          }}
          display="none"
          className="actions"
        >
          <ButtonGroup>
            {onRename && <Button onClick={() => promptRename(name).then(onRename)}>Rename</Button>}
            {setPinned && <Button onClick={() => setPinned(!pinned)}>{pinned ? "Unpin" : "Pin"}</Button>}
            <Button onClick={() => linkRef.current?.click?.()}>Edit</Button>
            {onDelete && <Button onClick={() => confirmDelete().then(onDelete)}>Delete</Button>}
          </ButtonGroup>
        </Box>
      </Box>
    </>
  );
};
