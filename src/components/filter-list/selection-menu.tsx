import React, { FC, useMemo } from "react";
import { Box, Button, ButtonGroup } from "@primer/react";
import { RowSelection } from "./types";
import { ListEndpointDefinition } from "../../common/filter-lists/list-endpoint-definition";
import { getActionsForEndpoint } from "../../actions/action-definitions";

export type SelectionMenuProps = {
  selection: RowSelection;
  endpoint: ListEndpointDefinition;
};

// TODO issue: pagination in table is handled manually, so changing the page screws up the selection

export const SelectionMenu: FC<SelectionMenuProps> = ({ selection, endpoint }) => {
  const selectedItemCount = Object.keys(selection).length;
  const actions = useMemo(() => getActionsForEndpoint(endpoint.id), [endpoint.id]);

  if (selectedItemCount === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bg: "accent.subtle",
        px: 2,
        py: 1,
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "accent.emphasis",
      }}
    >
      <Box flexGrow={1} fontSize={1}>
        {selectedItemCount} items selected.
      </Box>
      <ButtonGroup>
        {actions.map((action) => (
          <Button size="small" key={action.id}>
            {action.name}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};
