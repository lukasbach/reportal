import { FilterListState } from "../../components/filter-list/types";
import {
  FieldType,
  FilterValue,
  ListSearchProps,
  OrderByOption,
  ResponseField,
  SearchQueryDefinition,
  ServerFilter,
} from "./types";
import { ParsedSearchResult } from "./search-utils";
import { cellRenderers } from "./cell-renderers";

export abstract class ListEndpointDefinition<T = any> {
  abstract readonly id: string;

  abstract readonly name: string;

  abstract readonly defaultData: FilterListState;

  abstract readonly responseFields: ResponseField[];

  abstract readonly serverFilters: ServerFilter[];

  abstract readonly orderByOptions: OrderByOption[] | undefined;

  abstract readonly getSelectedOrderBy: ((state: ParsedSearchResult) => OrderByOption | undefined) | undefined;

  abstract getSearchQueries(searchProps: ListSearchProps): SearchQueryDefinition;

  protected getOrderByFilterKeys(options: OrderByOption[]) {
    const orderByFilterKeys = options?.map((option) => option.key);
    return (
      orderByFilterKeys?.map<ServerFilter>((key) => ({
        key,
        multiple: false,
        suggestions: this.orderByOptions?.filter((option) => option.key === key).map((option) => option.value) || [],
      })) ?? []
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clickAction(item: T) {}

  protected getFiltersAsMap(filters: FilterValue<ServerFilter>[]) {
    return filters.reduce<Record<string, FilterValue<ServerFilter>>>((acc, filter) => {
      acc[filter.filter.key] = filter;
      return acc;
    }, {});
  }

  protected responseField = {
    text: (name: string, jsonKey: string): ResponseField => ({
      jsonKey,
      name,
      type: FieldType.Text,
    }),
    user: (name: string, jsonKey: string, login = "login", avatarUrl = "avatarUrl"): ResponseField => ({
      jsonKey: `${jsonKey}.${login}`,
      name,
      type: FieldType.User,
      renderCell: cellRenderers.author(jsonKey, login, avatarUrl),
    }),
    date: (name: string, jsonKey: string): ResponseField => ({
      jsonKey,
      name,
      type: FieldType.Date,
      renderCell: cellRenderers.date(),
    }),
    url: (name: string, jsonKey: string): ResponseField => ({
      jsonKey,
      name,
      type: FieldType.Text,
    }),
    number: (name: string, jsonKey: string): ResponseField => ({
      jsonKey,
      name,
      type: FieldType.Number,
    }),
    diskUsage: (name: string, jsonKey: string): ResponseField => ({
      jsonKey,
      name,
      type: FieldType.Text,
      renderCell: cellRenderers.diskUsage(),
    }),
    boolean: (name: string, jsonKey: string): ResponseField => ({
      jsonKey,
      name,
      renderCell: cellRenderers.boolean(),
      suggestions: ["true", "false"],
      type: FieldType.Boolean,
    }),
    enum: (name: string, jsonKey: string, options: string[]): ResponseField => ({
      jsonKey,
      name,
      suggestions: options,
      type: FieldType.Enum,
    }),
    custom: (name: string, jsonKey: string, renderCell?: ResponseField["renderCell"]): ResponseField => ({
      jsonKey,
      name,
      renderCell,
      type: FieldType.Text,
    }),
  };

  protected serverFilter = {
    text: (key: string, label: string, multiple = false): ServerFilter => ({
      key,
      desc: label,
      multiple,
      type: FieldType.Text,
    }),
    boolean: (key: string, label: string, multiple = false): ServerFilter => ({
      key,
      desc: label,
      multiple,
      suggestions: ["true", "false"],
      type: FieldType.Boolean,
    }),
    date: (key: string, label: string, multiple = false): ServerFilter => ({
      key,
      desc: label,
      multiple,
      type: FieldType.Date,
    }),
    enum: (key: string, label: string, options: string[], multiple = false): ServerFilter => ({
      key,
      desc: label,
      multiple,
      suggestions: options,
      type: FieldType.Enum,
    }),
  };
}
