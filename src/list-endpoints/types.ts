import { Octokit } from "@octokit/rest";

export type ResponseField = {
  jsonKey: string;
  name: string;
  suggestions?: string[];
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
  page: number;
  searchStrings: string[];
};

export type Action<T> = {
  name: string;
  action: (items: T[], octokit: Octokit) => Promise<void>;
};

export abstract class ListEndpointDefinition<T> {
  abstract readonly name: string;

  abstract readonly responseFields: ResponseField[];

  abstract readonly serverFilters: ServerFilter[];

  abstract search(searchProps: ListSearchProps): Promise<T[]>;
  abstract readonly actions: Action<T>[];
}
