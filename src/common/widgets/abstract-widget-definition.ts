import { FC } from "react";
import { WidgetDisplayComponent, WidgetConfigComponent, WidgetIconComponent } from "./types";

export abstract class AbstractWidgetDefinition<T = any> {
  abstract readonly id: string;

  abstract readonly name: string;

  abstract readonly defaultSize: readonly [number, number] | undefined;

  abstract readonly minSize: readonly [number, number] | undefined;

  abstract readonly configComponent: WidgetConfigComponent<T>;

  abstract readonly displayComponent: WidgetDisplayComponent<T>;

  abstract readonly iconComponent: WidgetIconComponent<T>;

  abstract readonly generalIconComponent: FC;

  abstract generateDefaultConfig(): Promise<T>;
}
