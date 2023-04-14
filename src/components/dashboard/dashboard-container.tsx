import React, { FC, ReactNode, useState } from "react";
import { Layouts, Responsive, WidthProvider } from "react-grid-layout";
import { ActionList, ActionMenu, Box } from "@primer/react";
import { PinIcon } from "@primer/octicons-react";
import { WidgetContainer } from "./widget-container";
import { widgetDefinitions } from "../../widgets/widget-definitions";
import { DashboardConfig } from "../../widgets/types";
import { WidgetContentRenderer } from "./widget-content-renderer";

export type DashboardContainerProps = {};
const ResponsiveGridLayout = WidthProvider(Responsive);

export const DashboardContainer: FC<DashboardContainerProps> = () => {
  const [layouts, setLayouts] = useState<Layouts>({
    lg: [
      { i: "a", x: 0, y: 0, w: 3, h: 4 },
      { i: "b", x: 3, y: 0, w: 5, h: 4, minW: 2, maxW: 5 },
      { i: "c", x: 8, y: 0, w: 2, h: 4 },
    ],
  });
  const [widgets, setWidgets] = useState<DashboardConfig["widgets"]>({
    a: { name: "Widget A", config: {}, type: "filterList" },
    b: { name: "Widget B", config: {}, type: "filterList" },
    c: { name: "Widget C", config: {}, type: "filterList" },
  });
  return (
    <Box
      sx={{
        " .react-grid-item.react-grid-placeholder": {
          bg: "accent.muted",
          transitionDuration: "200ms",
        },
      }}
    >
      <ActionMenu>
        <ActionMenu.Button variant="primary" size="large" sx={{ m: 2 }}>
          Add Widget
        </ActionMenu.Button>

        <ActionMenu.Overlay>
          <ActionList sx={{ width: "240px" }}>
            {Object.values(widgetDefinitions).map((widget) => (
              <ActionList.Item key={widget.id}>{widget.name}</ActionList.Item>
            ))}
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        onLayoutChange={(layout, layouts) => setLayouts(layouts)}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        draggableHandle=".draghandle"
      >
        {Object.entries(widgets).map(([key, widget]) => (
          <div key={key}>
            <WidgetContainer title={widget.name} icon={<PinIcon />} key={key}>
              <WidgetContentRenderer widget={widget} widgetId={key} />
            </WidgetContainer>
          </div>
        ))}
      </ResponsiveGridLayout>
    </Box>
  );
};
