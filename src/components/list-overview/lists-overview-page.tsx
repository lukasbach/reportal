import React, { FC } from "react";
import { Box, Button } from "@primer/react";
import { useCreateFilterList, useGetFilterLists } from "./hooks";
import { FilterListItem } from "./filter-list-item";

export const ListsOverviewPage: FC = () => {
  const [value] = useGetFilterLists();
  const createItem = useCreateFilterList();
  return (
    <Box p={4}>
      {value?.docs
        ?.sort((a, b) => a.data().state.name.localeCompare(b.data().state.name))
        .map((item) => (
          <FilterListItem entry={item.data()} id={item.id} key={item.id} />
        ))}
      <Button onClick={createItem}>Create new Filter List</Button>
    </Box>
  );
};
