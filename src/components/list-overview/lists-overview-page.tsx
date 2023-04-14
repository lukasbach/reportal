import React, { FC } from "react";
import { ActionList, ActionMenu, Box } from "@primer/react";
import { useCreateFilterList, useGetFilterLists } from "./hooks";
import { FilterListItem } from "./filter-list-item";
import { endpoints } from "../../list-endpoints/endpoints";
import { EndpointIcon } from "../common/endpoint-icon";

export const ListsOverviewPage: FC = () => {
  const [value] = useGetFilterLists();
  const createFilterList = useCreateFilterList();
  return (
    <Box p={4}>
      <ActionMenu>
        <ActionMenu.Button variant="primary" size="large">
          Create new Filter List
        </ActionMenu.Button>

        <ActionMenu.Overlay>
          <ActionList sx={{ width: "240px" }}>
            {Object.values(endpoints).map((endpoint) => (
              <ActionList.Item key={endpoint.id} onClick={() => createFilterList(endpoint)}>
                <ActionList.LeadingVisual>
                  <EndpointIcon endpointId={endpoint.id} size={16} />
                </ActionList.LeadingVisual>
                {endpoint.name}
              </ActionList.Item>
            ))}
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
      <br />
      {value?.docs
        ?.sort((a, b) => a.data().state.name?.localeCompare(b.data().state.name))
        .map((item) => (
          <FilterListItem entry={item.data()} id={item.id} key={item.id} />
        ))}
    </Box>
  );
};
