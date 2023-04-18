import React, { FC, useMemo } from "react";
import { Box, Button } from "@primer/react";
import { GraphIcon } from "@primer/octicons-react";
import { useNavigate } from "react-router";
import { OverviewListItem } from "../common/overview-list/overview-list-item";
import { DashboardConfigEntry } from "../../common/widgets/types";
import {
  useCreateDashboard,
  useDeleteDashboard,
  useGetDashboards,
  useUpdateDashboard,
} from "../../firebase/dashboards";
import { PageHeader } from "../common/page-header";
import { useCreateTemplateDialog } from "./use-create-template-dialog";

const DashboardListItem: FC<{
  entry: DashboardConfigEntry;
  id: string;
}> = ({ entry, id }) => {
  const deleteDashboard = useDeleteDashboard();
  const updateDashboard = useUpdateDashboard();
  const widgetCount = useMemo(() => Object.keys(JSON.parse(entry.state.widgets)).length, [entry.state.widgets]);

  return (
    <OverviewListItem
      name={entry.state.name}
      bottom={`${widgetCount} widgets`}
      icon={<GraphIcon size={16} />}
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
  const { returnRef, createFromTemplate, dialog } = useCreateTemplateDialog();
  const navigate = useNavigate();
  return (
    <Box p={4}>
      {dialog}
      <PageHeader
        title="Dashboards"
        subtitle="Manage your dashboards, or create a new one. You can use dashboards to keep track of issue and PR counts, create repo-related graphs, or embed multiple filter lists into one page."
        icon={<GraphIcon />}
      >
        <Box display="flex">
          <Button size="large" sx={{ mr: 2 }} onClick={createFromTemplate} ref={returnRef}>
            Create from template...
          </Button>
          <Button
            variant="primary"
            size="large"
            onClick={() => createDashboard().then(({ id }) => navigate(`/app/dashboards/${id}`))}
          >
            Create new Dashboard
          </Button>
        </Box>
      </PageHeader>
      <br />
      {value?.docs
        ?.sort((a, b) => a.data().state.name?.localeCompare(b.data().state.name))
        .map((item) => (
          <DashboardListItem entry={item.data()} id={item.id} key={item.id} />
        ))}
    </Box>
  );
};
