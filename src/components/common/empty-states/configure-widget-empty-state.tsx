import React, { FC } from "react";
import { Button } from "@primer/react";
import { GearIcon } from "@primer/octicons-react";
import { EmptyState } from "./empty-state";

export type ConfigureWidgetEmptyStateProps = {
  onEdit: () => void;
};

export const ConfigureWidgetEmptyState: FC<ConfigureWidgetEmptyStateProps> = ({ onEdit }) => {
  return (
    <EmptyState text="Configure this widget to see some data">
      <Button onClick={onEdit} leadingIcon={GearIcon}>
        Configure Widget
      </Button>
    </EmptyState>
  );
};
