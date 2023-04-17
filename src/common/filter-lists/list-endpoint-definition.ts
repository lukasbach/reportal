import { FilterListState } from "../../components/filter-list/types";
import {
  FilterValue,
  ListSearchProps,
  OrderByOption,
  ResponseField,
  SearchQueryDefinition,
  ServerFilter,
} from "./types";
import { ParsedSearchResult } from "./search-utils";

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
}
