import React, { FC, useMemo } from "react";
import { useParams } from "react-router";
import { DashboardContainer } from "./dashboard-container";
import { useDashboardData, useUpdateDashboard } from "../../firebase/dashboards";
import { DashboardConfig } from "../../common/widgets/types";

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
        const state = {
          ...newData,
          widgets: JSON.stringify(newData.widgets),
          layouts: JSON.stringify(newData.layouts),
        };
        // console.log(JSON.stringify(state));
        update(newId, {
          state,
          user: data.user,
        });
      }}
    />
  );
};
