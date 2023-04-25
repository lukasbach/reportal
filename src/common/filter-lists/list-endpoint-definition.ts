import { FilterListState } from "../../components/filter-list/types";
import { FieldType, FilterValue, ListSearchProps, OrderByOption, SearchQueryDefinition, ListField } from "./types";
import { ParsedSearchResult } from "./search-utils";
import { cellRenderers } from "./cell-renderers";

export abstract class ListEndpointDefinition<T = any> {
  abstract readonly id: string;

  abstract readonly name: string;

  abstract readonly defaultData: FilterListState;

  abstract readonly responseFields: ListField[];

  abstract readonly serverFilters: ListField[];

  abstract readonly orderByOptions: OrderByOption[] | undefined;

  abstract readonly getSelectedOrderBy: ((state: ParsedSearchResult) => OrderByOption | undefined) | undefined;

  abstract getSearchQueries(searchProps: ListSearchProps): SearchQueryDefinition;

  protected getOrderByFilterKeys(options: OrderByOption[]) {
    const orderByFilterKeys = options?.map((option) => option.key);
    return (
      orderByFilterKeys?.map<ListField>((key) => ({
        key,
        name: `Order by...`,
        multiple: false,
        suggestions: this.orderByOptions?.filter((option) => option.key === key).map((option) => option.value) || [],
      })) ?? []
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clickAction(item: T) {}

  protected getFiltersAsMap(filters: FilterValue<ListField>[]) {
    return filters.reduce<Record<string, FilterValue<ListField>>>((acc, filter) => {
      acc[filter.filter.key] = filter;
      return acc;
    }, {});
  }

  protected responseField = {
    text: (name: string, key: string): ListField => ({
      key,
      name,
      type: FieldType.Text,
    }),
    user: (name: string, key: string, login = "login", avatarUrl = "avatarUrl"): ListField => ({
      key: `${key}.${login}`,
      name,
      type: FieldType.User,
      renderCell: cellRenderers.author(key, login, avatarUrl),
    }),
    date: (name: string, key: string): ListField => ({
      key,
      name,
      type: FieldType.Date,
      renderCell: cellRenderers.date(),
    }),
    url: (name: string, key: string): ListField => ({
      key,
      name,
      type: FieldType.Text,
    }),
    number: (name: string, key: string): ListField => ({
      key,
      name,
      type: FieldType.Number,
    }),
    diskUsage: (name: string, key: string): ListField => ({
      key,
      name,
      type: FieldType.Text,
      renderCell: cellRenderers.diskUsage(),
    }),
    boolean: (name: string, key: string): ListField => ({
      key,
      name,
      renderCell: cellRenderers.boolean(),
      suggestions: ["true", "false"],
      type: FieldType.Boolean,
    }),
    enum: (name: string, key: string, options: string[]): ListField => ({
      key,
      name,
      suggestions: options,
      type: FieldType.Enum,
    }),
    custom: (name: string, key: string, renderCell?: ListField["renderCell"]): ListField => ({
      key,
      name,
      renderCell,
      type: FieldType.Text,
    }),
  };

  protected serverFilter = {
    text: (key: string, label: string, multiple = false): ListField => ({
      key,
      name: label,
      multiple,
      type: FieldType.Text,
    }),
    boolean: (key: string, label: string, multiple = false): ListField => ({
      key,
      name: label,
      multiple,
      suggestions: ["true", "false"],
      type: FieldType.Boolean,
    }),
    date: (key: string, label: string, multiple = false): ListField => ({
      key,
      name: label,
      multiple,
      type: FieldType.Date,
    }),
    enum: (key: string, label: string, options: string[], multiple = false): ListField => ({
      key,
      name: label,
      multiple,
      suggestions: options,
      type: FieldType.Enum,
    }),
  };
}
