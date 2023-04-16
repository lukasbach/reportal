import { WidgetDisplayComponent, WidgetConfigComponent } from "./types";

export abstract class AbstractWidgetDefinition<T = any> {
  abstract readonly id: string;

  abstract readonly name: string;

  abstract readonly defaultSize: readonly [number, number] | undefined;

  abstract readonly configComponent: WidgetConfigComponent<T>;

  abstract readonly displayComponent: WidgetDisplayComponent<T>;
  abstract generateDefaultConfig(): Promise<T>;
}
