import React, { FC, ReactNode, useState } from "react";
import {
  Box,
  FormControl,
  Text,
  Link,
  Button,
  SelectPanel,
  Select,
  IconButton,
  Dialog,
  ActionMenu,
  ActionList,
} from "@primer/react";
import { ChevronDownIcon, ChevronLeftIcon, TriangleDownIcon, XCircleFillIcon } from "@primer/octicons-react";
import { createPortal } from "react-dom";
import { EmbeddedFilterListPayload } from "../filter-list/types";
import { useGetFilterLists } from "../list-overview/hooks";
import { endpoints, getEndpoint } from "../../list-endpoints/endpoints";
import { EndpointIcon } from "./endpoint-icon";

const EmbeddedSelector: FC<
  FilterListSelectorProps & {
    state: EmbeddedFilterListPayload & { type: "embedded" };
  }
> = ({ state, onChange }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Box display="flex" alignItems="center">
        <ActionMenu>
          <ActionMenu.Anchor>
            <IconButton icon={ChevronDownIcon} sx={{ mr: 2 }} aria-label="Change filter list type" />
          </ActionMenu.Anchor>

          <ActionMenu.Overlay>
            <ActionList sx={{ width: "240px" }}>
              {Object.values(endpoints).map((endpoint) => (
                <ActionList.Item
                  key={endpoint.id}
                  onClick={() => onChange({ type: "embedded", state: endpoint.defaultData })}
                >
                  <ActionList.LeadingVisual>
                    <EndpointIcon endpointId={endpoint.id} size={16} />
                  </ActionList.LeadingVisual>
                  {endpoint.name}
                </ActionList.Item>
              ))}
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
        <Box flexGrow={1}>
          <Text fontSize={1} color="fg.muted">
            {state.state.search}
          </Text>
          <br />
          <Text fontSize={2}>{getEndpoint(state.state.endpointId).name}</Text>
        </Box>
        <Button sx={{ mx: 2 }} onClick={() => setIsDialogOpen(true)}>
          Edit
        </Button>
        <IconButton
          onClick={() => onChange({ type: "unset" })}
          aria-label="Clear Filter List Config"
          icon={XCircleFillIcon}
        />
      </Box>
      {isDialogOpen &&
        createPortal(
          <Dialog isOpen sx={{ width: "800px" }} onDismiss={() => setIsDialogOpen(false)}>
            Hello!
          </Dialog>,
          document.getElementById("filterlist-portal")!
        )}
    </>
  );
};

export type FilterListSelectorProps = {
  state: EmbeddedFilterListPayload;
  onChange: (state: EmbeddedFilterListPayload) => void;
};

export const FilterListSelector: FC<FilterListSelectorProps> = ({ state, onChange }) => {
  const [filterLists] = useGetFilterLists();
  return (
    <FormControl>
      <FormControl.Label>Filter List</FormControl.Label>
      <Box
        sx={{
          width: "100%",
          borderRadius: "8px",
          border: state.type === "unset" ? "2px dashed" : "1px solid",
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

        {state.type === "embedded" && <EmbeddedSelector state={state} onChange={onChange} />}

        {state.type === "unset" && (
          <Text fontSize={1}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link as="button" onClick={() => onChange({ type: "linked", id: "" })}>
              Attach one of your existing filter lists
            </Link>
            , or {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link as="button" onClick={() => onChange({ type: "embedded", state: getEndpoint("issues").defaultData })}>
              create one that will be specific to this widget
            </Link>
            .
          </Text>
        )}
      </Box>
    </FormControl>
  );
};
