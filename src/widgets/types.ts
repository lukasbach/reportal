import { FC, RefObject } from "react";
import { Layouts } from "react-grid-layout";

export type WidgetConfigComponent<T> = FC<{
  config: T;
  onChange: (payload: Partial<T>) => void;
}>;

export type WidgetDisplayComponent<T> = FC<{
  config: T;
  actionsRef: RefObject<HTMLDivElement>;
}>;

export type DashboardConfig = {
  layouts: Layouts;
  widgets: Record<string, { config: any; name: string; type: string }>;
};