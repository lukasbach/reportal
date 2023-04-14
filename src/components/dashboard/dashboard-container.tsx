import React, { FC, ReactNode } from "react";
import GridLayout from "react-grid-layout";
import { ActionList, ActionMenu, Box } from "@primer/react";
import { PinIcon } from "@primer/octicons-react";
import { WidgetContainer } from "./widget-container";
import { endpoints } from "../../list-endpoints/endpoints";
import { EndpointIcon } from "../common/endpoint-icon";
import { widgets } from "../../widgets/widgets";

export type DashboardContainerProps = {};

export const DashboardContainer: FC<DashboardContainerProps> = () => {
  const layout = [
    { i: "a", x: 0, y: 0, w: 3, h: 4 },
    { i: "b", x: 3, y: 0, w: 5, h: 4, minW: 2, maxW: 5 },
    { i: "c", x: 8, y: 0, w: 2, h: 4 },
  ];
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
            {Object.values(widgets).map((widget) => (
              <ActionList.Item key={widget.id}>{widget.name}</ActionList.Item>
            ))}
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>

      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        draggableHandle=".draghandle"
      >
        <div key="a">
          <WidgetContainer title="Widget Title" icon={<PinIcon />} key="a">
            Children
          </WidgetContainer>
        </div>
        <div key="b">
          <WidgetContainer title="Widget Title" icon={<PinIcon />} key="a">
            Children
          </WidgetContainer>
        </div>
        <div key="c">
          <WidgetContainer title="Widget Title" icon={<PinIcon />} key="a">
            Children
          </WidgetContainer>
        </div>
      </GridLayout>
    </Box>
  );
};
