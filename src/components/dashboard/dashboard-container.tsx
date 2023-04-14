import React, { FC, ReactNode } from "react";
import GridLayout from "react-grid-layout";
import { Box } from "@primer/react";
import { PinIcon } from "@primer/octicons-react";
import { WidgetContainer } from "./widget-container";

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
