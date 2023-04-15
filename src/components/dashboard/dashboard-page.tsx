import React, { FC, useMemo } from "react";
import { useParams } from "react-router";
import { DashboardContainer } from "./dashboard-container";
import { useDashboardData, useUpdateDashboard } from "../../firebase/dashboards";
import { DashboardConfig } from "../../widgets/types";

export const DashboardPage: FC = () => {
  const { id } = useParams();
  const [value] = useDashboardData(id ?? null);
  const update = useUpdateDashboard();
  const data = value?.data();
  const parsedData = useMemo<DashboardConfig | undefined>(
    () =>
      data
        ? {
            ...data.state,
            widgets: JSON.parse(data.state.widgets),
            layouts: JSON.parse(data.state.layouts),
          }
        : undefined,
    [data]
  );
  if (!parsedData || !id) {
    return null;
  }
  return (
    <DashboardContainer
      id={id}
      data={parsedData}
      onUpdate={(newId, newData) => {
        if (!data) {
          return;
        }
        console.log("Updating", newId, newData, "to firebase");
        update(newId, {
          state: { ...newData, widgets: JSON.stringify(newData.widgets), layouts: JSON.stringify(newData.layouts) },
          user: data.user,
        });
      }}
    />
  );
};
