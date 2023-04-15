import React, { FC, useRef } from "react";
import { PinIcon } from "@primer/octicons-react";
import { DashboardConfig } from "../../widgets/types";
import { getWidgetDefinition } from "../../widgets/widget-definitions";
import { WidgetContainer } from "./widget-container";

export type WidgetContentRendererProps = {
  widget: DashboardConfig["widgets"][string];
  onEdit: () => void;
};

export const WidgetContentRenderer: FC<WidgetContentRendererProps> = ({ widget, onEdit }) => {
  const actionsRef = useRef<HTMLDivElement>(null);
  const widgetDefinition = getWidgetDefinition(widget.type);
  return (
    <WidgetContainer title={widget.name} icon={<PinIcon />} actionsRef={actionsRef} onEdit={onEdit}>
      {widgetDefinition.displayComponent({ config: widget.config, actionsRef })}
    </WidgetContainer>
  );
};
