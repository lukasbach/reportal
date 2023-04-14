import React, { FC } from "react";
import { Box, Button } from "@primer/react";
import { useCreateFilterList, useGetFilterLists } from "./hooks";
import { FilterListItem } from "./filter-list-item";
import { endpoints } from "../../list-endpoints/endpoints";

export const ListsOverviewPage: FC = () => {
  const [value] = useGetFilterLists();
  const createIssueItem = useCreateFilterList(endpoints.issues);
  const createNotificationItem = useCreateFilterList(endpoints.notifications);
  return (
    <Box p={4}>
      {value?.docs
        ?.sort((a, b) => a.data().state.name?.localeCompare(b.data().state.name))
        .map((item) => (
          <FilterListItem entry={item.data()} id={item.id} key={item.id} />
        ))}
      <Button onClick={createIssueItem}>Create new Filter List for Issues</Button>
      <br />
      <Button onClick={createNotificationItem}>Create new Filter List for Notifications</Button>
    </Box>
  );
};
