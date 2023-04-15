import React, { FC, ReactNode } from "react";
import { DashboardConfig } from "../../widgets/types";
import { getWidgetDefinition, widgetDefinitions } from "../../widgets/widget-definitions";

export type WidgetContentRendererProps = {
  widget: DashboardConfig["widgets"][string];
  widgetId: string;
};

export const WidgetContentRenderer: FC<WidgetContentRendererProps> = ({ widget }) => {
  const widgetDefinition = getWidgetDefinition(widget.type);
  return widgetDefinition.displayComponent({ config: widget.config });
};
