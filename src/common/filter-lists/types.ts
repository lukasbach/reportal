import { Octokit } from "@octokit/rest";
import { QueryFunctionContext, QueryKey } from "@tanstack/react-query";

export enum FieldType {
  Text = "text",
  User = "user",
  Enum = "enum",
  Boolean = "boolean",
  Date = "date",
  Number = "number",
  Range = "range",
}

export type ResponseField = {
  jsonKey: string;
  name: string;
  suggestions?: string[];
  type?: FieldType;
  renderCell?: (value: string, dataObject: any) => JSX.Element | string;
};

export type ServerFilter = {
  key: string;
  desc?: string;
  suggestions?: string[];
  type?: FieldType;
  multiple?: boolean;
};

export type OrderByOption = {
  name: string;
  value: string;
  key: string;
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

export type SearchQueryDefinition = (ctx: QueryFunctionContext<QueryKey, string>) => Promise<{
  result: any[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string;
  startCursor: string;
  resultCount?: number;
}>;
