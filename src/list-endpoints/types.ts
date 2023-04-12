import { Octokit } from "@octokit/rest";
import { QueryFunctionContext, QueryKey } from "@tanstack/react-query";

export type ResponseField = {
  jsonKey: string;
  name: string;
  suggestions?: string[];
  renderCell?: (value: string, dataObject: any) => JSX.Element | string;
};

export type ServerFilter = {
  key: string;
  suggestions?: string[];
  multiple?: boolean;
};

export type FilterValue<K> = {
  filter: K;
  value: string;
  negated: boolean;
};

export type UnclassifiedFilter = {
  key: string;
  value: string;
  negated: boolean;
};

export type ListSearchProps = {
  octokit: Octokit;
  filters: FilterValue<ServerFilter>[];
  pageSize: number;
  searchStrings: string[];
};

export type SearchQueryDefinition = (ctx: QueryFunctionContext<QueryKey, { cursor: string }>) => Promise<{
  result: any[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string;
  startCursor: string;
  resultCount: number;
}>;

export type Action<T> = {
  name: string;
  action: (items: T[], octokit: Octokit) => Promise<void>;
};

export abstract class ListEndpointDefinition<T = any> {
  abstract readonly name: string;

  abstract readonly defaultFields: string[];

  abstract readonly responseFields: ResponseField[];

  abstract readonly serverFilters: ServerFilter[];

  abstract getSearchQueries(searchProps: ListSearchProps): SearchQueryDefinition;
  abstract readonly actions: Action<T>[];
}
