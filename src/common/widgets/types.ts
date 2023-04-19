import { FC, RefObject } from "react";
import { Layouts } from "react-grid-layout";

export type WidgetConfigComponent<T> = FC<{
  config: T;
  onChange: (payload: Partial<T>) => void;
}>;

export type WidgetDisplayComponent<T> = FC<{
  config: T;
  actionsRef: RefObject<HTMLDivElement>;
  onEdit: () => void;
  onChange: (payload: Partial<T>) => void;
}>;

export type WidgetIconComponent<T> = FC<{
  config: T;
}>;

export type WidgetPayload<T = any> = {
  config: T;
  name: string;
  type: string;
  color: string;
};

export type DashboardConfig = {
  layouts: Layouts;
  widgets: Record<string, WidgetPayload>;
  pinned?: boolean;
  name: string;
};

export type DashboardConfigEntry = {
  state: {
    pinned?: boolean;
    name: string;
    layouts: string;
    widgets: string;
  };
  user: string;
};
