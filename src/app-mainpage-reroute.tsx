import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router";
import { useGetPinnedDashboards } from "./firebase/dashboards";
import { LoadingEmptyState } from "./components/common/empty-states/loading-empty-state";

export const AppMainpageReroute: FC = () => {
  const [dashboards, isLoading] = useGetPinnedDashboards();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (dashboards?.docs && dashboards.docs.length > 0) {
      navigate(`/app/dashboards/${dashboards.docs[0].id}`);
      return;
    }

    navigate("/app/dashboards");
  }, [dashboards, isLoading, navigate]);

  return <LoadingEmptyState />;
};
