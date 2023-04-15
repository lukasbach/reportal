import React, { FC, ReactNode, useState } from "react";
import { Box, FormControl, Text, Link, Button, SelectPanel, Select, IconButton } from "@primer/react";
import { ChevronLeftIcon, TriangleDownIcon, XCircleFillIcon } from "@primer/octicons-react";
import { EmbeddedFilterListPayload } from "../filter-list/types";
import { useGetFilterLists } from "../list-overview/hooks";

export type FilterListSelectorProps = {
  state: EmbeddedFilterListPayload;
  onChange: (state: EmbeddedFilterListPayload) => void;
};

export const FilterListSelector: FC<FilterListSelectorProps> = ({ state, onChange }) => {
  const [filterLists] = useGetFilterLists();
  const [isLinkedDropdownOpen, setIsLinkedDropdownOpen] = useState(false);
  return (
    <FormControl>
      <FormControl.Label>Filter List</FormControl.Label>
      <Box
        sx={{
          width: "100%",
          borderRadius: "8px",
          border: "2px dotted",
          borderColor: "border.default",
          bg: "canvas.subtle",
          boxShadow: "shadow.small",
          p: 2,
        }}
      >
        {state.type === "linked" && (
          <Box display="flex">
            <Box flexGrow={1} mr={2} sx={{ "> span": { width: "100%" } }}>
              <Select
                onChange={(e) => {
                  onChange({ type: "linked", id: e.target.value as string });
                }}
                value={state.id}
              >
                {filterLists?.docs.map((filterList) => (
                  <Select.Option key={filterList.id} value={filterList.id}>
                    {filterList.data().state.name}
                  </Select.Option>
                ))}
              </Select>
            </Box>
            <IconButton
              onClick={() => onChange({ type: "unset" })}
              aria-label="Clear Filter List Config"
              icon={XCircleFillIcon}
            />
          </Box>
        )}

        {state.type === "embedded" && (
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>
              <Text fontSize={1}>adsj aklsd laksjd l</Text>
              <br />
              <Text fontSize={2}>adsj aklsd laksjd l</Text>
            </Box>
            <Button sx={{ mx: 2 }}>Edit</Button>
            <IconButton
              onClick={() => onChange({ type: "unset" })}
              aria-label="Clear Filter List Config"
              icon={XCircleFillIcon}
            />
          </Box>
        )}

        {state.type === "unset" && (
          <Text fontSize={1}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link as="button" onClick={() => onChange({ type: "linked", id: "" })}>
              Attach one of your existing filter lists
            </Link>
            , or {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link as="button" onClick={() => onChange({ type: "embedded", state: {} })}>
              create one that will be specific to this widget
            </Link>
            .
          </Text>
        )}
      </Box>
    </FormControl>
  );
};
