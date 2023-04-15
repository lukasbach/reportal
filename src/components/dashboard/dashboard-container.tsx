import React, { FC, useState } from "react";
import { Layouts, Responsive, WidthProvider } from "react-grid-layout";
import { ActionList, ActionMenu, Box } from "@primer/react";
import { widgetDefinitions } from "../../widgets/widget-definitions";
import { DashboardConfig } from "../../widgets/types";
import { WidgetContentRenderer } from "./widget-content-renderer";
import { WidgetConfigDialog } from "./widget-config-dialog";
import { useStableHandler } from "../../utils";

export type DashboardContainerProps = {};
const ResponsiveGridLayout = WidthProvider(Responsive);

export const DashboardContainer: FC<DashboardContainerProps> = () => {
  const [editingWidget, setEditingWidget] = useState<string | null>(null);
  const [layouts, setLayouts] = useState<Layouts>({
    lg: [
      { i: "a", x: 0, y: 0, w: 3, h: 4 },
      { i: "b", x: 3, y: 0, w: 5, h: 4, minW: 2, maxW: 5 },
      { i: "c", x: 8, y: 0, w: 2, h: 4 },
    ],
  });
  const [widgets, setWidgets] = useState<DashboardConfig["widgets"]>({
    a: {
      name: "Widget A",
      config: {
        filterList: {
          type: "linked",
          id: "iDMNhce098Q7aCJbxOqH",
        },
      },
      type: "filterList",
    },
    b: { name: "Widget B", config: { filterList: { type: "linked", id: "j5Gbf89JjlPxe4RxMhtX" } }, type: "filterList" },
    c: { name: "Widget C", config: { filterList: { type: "unset" } }, type: "filterList" },
  });
  const applyWidgetChanges = useStableHandler((newConfig: DashboardConfig["widgets"][string]) => {
    if (!editingWidget) {
      return;
    }
    setWidgets((old) => ({ ...old, [editingWidget]: { ...old[editingWidget], config: newConfig } }));
  });
  return (
    <>
      <Box
        sx={{
          " .react-grid-item.react-grid-placeholder": {
            bg: "accent.muted",
            transitionDuration: "200ms",
            borderRadius: "16px",
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
              <WidgetContentRenderer widget={widget} onEdit={() => setEditingWidget(key)} />
            </div>
          ))}
        </ResponsiveGridLayout>
      </Box>

      {editingWidget && (
        <WidgetConfigDialog
          widget={widgets[editingWidget]}
          onChange={applyWidgetChanges}
          onClose={() => setEditingWidget(null)}
        />
      )}
    </>
  );
};
