import { FC } from "react";

export type WidgetConfigComponent<T> = FC<{
  config: T;
  onChange: (config: Partial<T>) => void;
}>;

export type WidgetDisplayComponent<T> = FC<{
  config: T;
}>;
