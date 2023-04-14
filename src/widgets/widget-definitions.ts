import { AbstractWidgetDefinition } from "./abstract-widget-definition";
import { FilterListWidget } from "./filter-list-widget";

export const widgetDefinitions: Record<string, AbstractWidgetDefinition> = {
  filterList: new FilterListWidget(),
};

export const getWidgetDefinition = (id: string) => {
  if (widgetDefinitions[id]) {
    return widgetDefinitions[id];
  }
  throw new Error(`Widget ${id} not found`);
};
