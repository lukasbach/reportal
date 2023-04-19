import React, { FC, useRef } from "react";
import { DashboardConfig, WidgetPayload } from "../../common/widgets/types";
import { getWidgetDefinition } from "../../widgets/widget-definitions";
import { WidgetContainer } from "./widget-container";
import { useStableHandler } from "../../utils";

export type WidgetContentRendererProps = {
  widget: DashboardConfig["widgets"][string];
  onEdit: () => void;
  onChange: (widgetConfig: any) => void;
};

export const WidgetContentRenderer: FC<WidgetContentRendererProps> = ({ widget, onEdit, onChange }) => {
  const actionsRef = useRef<HTMLDivElement>(null);
  const widgetDefinition = getWidgetDefinition(widget.type);

  const partialOnChange = useStableHandler((updated: Partial<WidgetPayload>) => {
    onChange({ ...widget.config, ...updated });
  });

  return (
    <WidgetContainer
      title={widget.name}
      icon={widgetDefinition.iconComponent({ config: widget.config })}
      actionsRef={actionsRef}
      onEdit={onEdit}
      color={widget.color}
    >
      {widgetDefinition.displayComponent({ config: widget.config, actionsRef, onEdit, onChange: partialOnChange })}
    </WidgetContainer>
  );
};
