import React, { FC, useRef } from "react";
import { PinIcon } from "@primer/octicons-react";
import { DashboardConfig } from "../../common/widgets/types";
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
    <WidgetContainer
      title={widget.name}
      icon={widgetDefinition.iconComponent({ config: widget.config })}
      actionsRef={actionsRef}
      onEdit={onEdit}
      color={widget.color}
    >
      {widgetDefinition.displayComponent({ config: widget.config, actionsRef, onEdit })}
    </WidgetContainer>
  );
};
