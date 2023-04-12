import React, { FC, useRef } from "react";
import { Box, Button, ButtonGroup, Text } from "@primer/react";
import { IssueOpenedIcon } from "@primer/octicons-react";
import { Link } from "react-router-dom";
import { FilterListStateEntry } from "../filter-list/types";
import { useConfirm, usePrompt } from "../../dialogs";
import { useDeleteFilterList, useUpdateFilterList } from "./hooks";

export type FilterListItemProps = {
  entry: FilterListStateEntry;
  id: string;
};

export const FilterListItem: FC<FilterListItemProps> = ({ entry, id }) => {
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const deleteList = useDeleteFilterList();
  const updateList = useUpdateFilterList();

  const { dialog: deleteDialog, confirm: confirmDelete } = useConfirm(
    "Delete list?",
    "Are you sure you want to delete this filter list?",
    "Delete",
    "No",
    true
  );
  const { dialog: renameDialog, prompt: promptRename } = usePrompt("Rename list", "List Name", "New name");

  const handleDelete = () => {
    confirmDelete().then(() => {
      deleteList(id);
    });
  };

  const handleRename = () => {
    promptRename(entry.state.name).then((newName) => {
      if (newName) {
        updateList(id, { state: { ...entry.state, name: newName }, user: entry.user });
      }
    });
  };

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
        <Box mr={3}>
          <IssueOpenedIcon size={24} />
        </Box>
        <Box flexGrow={1}>
          <Text fontSize="1" color="fg.muted">
            Issues and Pull Requests
          </Text>
          <Link to={`/app/filterlists/${id}`} className="unstyled-link" ref={linkRef}>
            <Box fontSize="3" color="fg.default" sx={{ textDecoration: "none" }}>
              {entry.state.name}
            </Box>
          </Link>
          <Box fontSize="1" color="fg.muted">
            {entry.state.search}
          </Box>
        </Box>
        <Box
          onClick={(e) => {
            e.stopPropagation();
          }}
          display="none"
          className="actions"
        >
          <ButtonGroup>
            <Button onClick={handleRename}>Rename</Button>
            <Button>Pin</Button>
            <Button>Edit</Button>
            <Button onClick={handleDelete}>Delete</Button>
          </ButtonGroup>
        </Box>
      </Box>
    </>
  );
};
