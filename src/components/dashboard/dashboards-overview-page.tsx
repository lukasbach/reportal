import React, { FC } from "react";
import { Box, Button } from "@primer/react";
import { GraphIcon } from "@primer/octicons-react";
import { OverviewListItem } from "../common/overview-list/overview-list-item";
import { DashboardConfigEntry } from "../../widgets/types";
import {
  useCreateDashboard,
  useDeleteDashboard,
  useGetDashboards,
  useUpdateDashboard,
} from "../../firebase/dashboards";

const DashboardListItem: FC<{
  entry: DashboardConfigEntry;
  id: string;
}> = ({ entry, id }) => {
  const deleteDashboard = useDeleteDashboard();
  const updateDashboard = useUpdateDashboard();

  return (
    <OverviewListItem
      name={entry.state.name}
      icon={<GraphIcon size={16} />}
      top="XXX"
      bottom="TZZZ"
      pinned={entry.state.pinned}
      href={`/app/dashboards/${id}`}
      itemLabel="Dashboard"
      onDelete={() => deleteDashboard(id)}
      onRename={(newName) => {
        if (newName) {
          updateDashboard(id, { state: { ...entry.state, name: newName }, user: entry.user });
        }
      }}
      setPinned={(pinned) => {
        updateDashboard(id, { state: { ...entry.state, pinned }, user: entry.user });
      }}
    />
  );
};

export const DashboardsOverviewPage: FC = () => {
  const [value] = useGetDashboards();
  const createDashboard = useCreateDashboard();
  return (
    <Box p={4}>
      <Button variant="primary" size="large" onClick={createDashboard}>
        Create new Dashboard
      </Button>
      <br />
      {value?.docs
        ?.sort((a, b) => a.data().state.name?.localeCompare(b.data().state.name))
        .map((item) => (
          <DashboardListItem entry={item.data()} id={item.id} key={item.id} />
        ))}
    </Box>
  );
};
