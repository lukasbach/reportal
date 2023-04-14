import { AbstractWidgetDefinition } from "./abstract-widget-definition";
import { FilterListWidget } from "./filter-list-widget";

export const widgets: Record<string, AbstractWidgetDefinition> = {
  filterList: new FilterListWidget(),
};

export const getWidget = (id: string) => {
  if (widgets[id]) {
    return widgets[id];
  }
  throw new Error(`Widget ${id} not found`);
};
