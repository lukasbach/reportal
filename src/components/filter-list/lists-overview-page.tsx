import React, { FC } from "react";
import { Box } from "@primer/react";
import {
  useCreateFilterList,
  useDeleteFilterList,
  useGetFilterLists,
  useUpdateFilterList,
} from "../../firebase/filter-lists";
import { getEndpoint } from "../../list-endpoints/endpoints";
import { EndpointIcon } from "../common/endpoint-icon";
import { FilterListStateEntry } from "./types";
import { OverviewListItem } from "../common/overview-list/overview-list-item";
import { FilterListTypeSelector } from "./filter-list-type-selector";

const FilterListItem: FC<{
  entry: FilterListStateEntry;
  id: string;
}> = ({ entry, id }) => {
  const deleteList = useDeleteFilterList();
  const updateList = useUpdateFilterList();
  const endpoint = getEndpoint(entry.state.endpointId);

  return (
    <OverviewListItem
      name={entry.state.name}
      icon={<EndpointIcon endpointId={endpoint.id} size={16} />}
      top={endpoint.name}
      bottom={entry.state.search}
      pinned={entry.state.pinned}
      href={`/app/filterlists/${id}`}
      itemLabel="Filter List"
      onDelete={() => deleteList(id)}
      onRename={(newName) => {
        if (newName) {
          updateList(id, { state: { ...entry.state, name: newName }, user: entry.user });
        }
      }}
      setPinned={(pinned) => {
        updateList(id, { state: { ...entry.state, pinned }, user: entry.user });
      }}
    />
  );
};

export const ListsOverviewPage: FC = () => {
  const [value] = useGetFilterLists();
  const createFilterList = useCreateFilterList();
  return (
    <Box p={4}>
      <FilterListTypeSelector onClick={createFilterList} variant="primary" size="large">
        Create new Filter List
      </FilterListTypeSelector>
      <br />
      {value?.docs
        ?.sort((a, b) => a.data().state.name?.localeCompare(b.data().state.name))
        .map((item) => (
          <FilterListItem entry={item.data()} id={item.id} key={item.id} />
        ))}
    </Box>
  );
};
