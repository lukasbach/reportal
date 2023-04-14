import React, { FC, useRef } from "react";
import { Box, Button, ButtonGroup, Text } from "@primer/react";
import { IssueOpenedIcon, PinIcon } from "@primer/octicons-react";
import { Link } from "react-router-dom";
import { FilterListStateEntry } from "../filter-list/types";
import { useConfirm, usePrompt } from "../../dialogs";
import { useDeleteFilterList, useUpdateFilterList } from "./hooks";
import { getEndpoint } from "../../list-endpoints/endpoints";
import { EndpointIcon } from "../common/endpoint-icon";

export type FilterListItemProps = {
  entry: FilterListStateEntry;
  id: string;
};

export const FilterListItem: FC<FilterListItemProps> = ({ entry, id }) => {
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const deleteList = useDeleteFilterList();
  const updateList = useUpdateFilterList();
  const endpoint = getEndpoint(entry.state.endpointId);

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

  const togglePin = () => {
    updateList(id, { state: { ...entry.state, pinned: !entry.state.pinned }, user: entry.user });
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
        <Box mr={3}>
          <EndpointIcon endpointId={endpoint.id} size={24} />
        </Box>
        <Box flexGrow={1}>
          <Text fontSize="1" color="fg.muted">
            {endpoint.name}
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
        <Box className="pin">{entry.state.pinned && <PinIcon size={16} />}</Box>
        <Box
          onClick={(e) => {
            e.stopPropagation();
          }}
          display="none"
          className="actions"
        >
          <ButtonGroup>
            <Button onClick={handleRename}>Rename</Button>
            <Button onClick={togglePin}>{entry.state.pinned ? "Unpin" : "Pin"}</Button>
            <Button onClick={() => linkRef.current?.click?.()}>Edit</Button>
            <Button onClick={handleDelete}>Delete</Button>
          </ButtonGroup>
        </Box>
      </Box>
    </>
  );
};
