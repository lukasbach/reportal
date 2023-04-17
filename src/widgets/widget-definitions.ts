import { AbstractWidgetDefinition } from "../common/widgets/abstract-widget-definition";
import { FilterListWidget } from "./filter-list-widget";
import { ValueBoardWidget } from "./value-board-widget";
import { LinkListWidget } from "./link-list-widget";
import { StargazerGraphWidget } from "./stargazer-graph-widget";
import { NpmDownloadGraphWidget } from "./npm-download-graph-widget";
import { OpenIssuesGraphWidget } from "./open-issues-graph-widget";

export const widgetDefinitions: Record<string, AbstractWidgetDefinition> = {
  filterList: new FilterListWidget(),
  valueBoard: new ValueBoardWidget(),
  linkList: new LinkListWidget(),
  stargazerGraph: new StargazerGraphWidget(),
  openIssuesGraph: new OpenIssuesGraphWidget(),
  npmDownloadGraph: new NpmDownloadGraphWidget(),
};

export const getWidgetDefinition = (id: string) => {
  if (widgetDefinitions[id]) {
    return widgetDefinitions[id];
  }
  throw new Error(`Widget ${id} not found`);
};
