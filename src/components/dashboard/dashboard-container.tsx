import React, { FC, useEffect, useState } from "react";
import { Layouts, Responsive, WidthProvider } from "react-grid-layout";
import { ActionList, ActionMenu, Box } from "@primer/react";
import { GraphIcon } from "@primer/octicons-react";
import { widgetDefinitions } from "../../widgets/widget-definitions";
import { DashboardConfig } from "../../common/widgets/types";
import { WidgetContentRenderer } from "./widget-content-renderer";
import { WidgetConfigDialog } from "./widget-config-dialog";
import { useStableHandler } from "../../utils";
import { AbstractWidgetDefinition } from "../../common/widgets/abstract-widget-definition";
import { useTriggerPersist } from "../../common/use-trigger-persist";
import { PageHeader } from "../common/page-header";

const ResponsiveGridLayout = WidthProvider(Responsive);
export type DashboardContainerProps = {
  id: string;
  data: DashboardConfig;
  onUpdate: (id: string, newData: DashboardConfig) => void;
};

export const DashboardContainer: FC<DashboardContainerProps> = ({ id, onUpdate, data }) => {
  const [name, setName] = useState(data.name);
  const [pinned, setPinned] = useState(data.pinned);
  const [editingWidget, setEditingWidget] = useState<string | null>(null);
  const [layouts, setLayouts] = useState<Layouts>(data.layouts);
  const [widgets, setWidgets] = useState(data.widgets);
  const applyWidgetChanges = useStableHandler((newConfig: DashboardConfig["widgets"][string], name: string, color: string) => {
    if (!editingWidget) {
      return;
    }
    setWidgets((old) => ({ ...old, [editingWidget]: { ...old[editingWidget], name, color, config: newConfig } }));
  });
  const deleteEditingWidget = useStableHandler(() => {
    if (!editingWidget) {
      return;
    }
    setWidgets((old) => {
      const { [editingWidget]: _, ...rest } = old;
      return rest;
    });
    setLayouts((old) => {
      for (const key of Object.keys(old)) {
        // eslint-disable-next-line no-param-reassign
        old[key] = old[key].filter((item) => item.i !== editingWidget);
      }
      return old;
    });
  });
  const addWidget = useStableHandler((widget: AbstractWidgetDefinition) => async () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const config = await widget.generateDefaultConfig();
    const [w, h] = widget.defaultSize ?? [3, 1];
    setWidgets((old) => ({
      ...old,
      [newId]: { name: widget.name, config, type: widget.id, color: "default" },
    }));
    setLayouts((old) => {
      for (const key of Object.keys(old)) {
        old[key].push({ i: newId, x: 0, y: Infinity, w, h });
      }
      return old;
    });
  });

  const markDirty = useTriggerPersist(id, onUpdate, { widgets, layouts, name, pinned });

  useEffect(markDirty, [widgets, layouts, name, pinned, markDirty]);

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
        <Box mx={2}>
          <PageHeader title={data.name} icon={<GraphIcon size={24} />} backLink="/app/dashboards" compact>
            <ActionMenu>
              <ActionMenu.Button variant="primary" size="large" sx={{ m: 2 }}>
                Add Widget
              </ActionMenu.Button>

              <ActionMenu.Overlay>
                <ActionList sx={{ width: "240px" }}>
                  {Object.values(widgetDefinitions).map((widget) => (
                    <ActionList.Item key={widget.id} onClick={addWidget(widget)}>
                      <ActionList.LeadingVisual>{widget.generalIconComponent({})}</ActionList.LeadingVisual>
                      {widget.name}
                    </ActionList.Item>
                  ))}
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </PageHeader>
        </Box>

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
          onDelete={deleteEditingWidget}
        />
      )}
    </>
  );
};
