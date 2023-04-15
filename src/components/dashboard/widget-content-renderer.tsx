import React, { FC, ReactNode, useRef } from "react";
import { PinIcon } from "@primer/octicons-react";
import { DashboardConfig } from "../../widgets/types";
import { getWidgetDefinition, widgetDefinitions } from "../../widgets/widget-definitions";
import { WidgetContainer } from "./widget-container";

export type WidgetContentRendererProps = {
  widget: DashboardConfig["widgets"][string];
};

export const WidgetContentRenderer: FC<WidgetContentRendererProps> = ({ widget }) => {
  const actionsRef = useRef<HTMLDivElement>(null);
  const widgetDefinition = getWidgetDefinition(widget.type);
  return (
    <WidgetContainer title={widget.name} icon={<PinIcon />} actionsRef={actionsRef}>
      {widgetDefinition.displayComponent({ config: widget.config, actionsRef })}
    </WidgetContainer>
  );
};
