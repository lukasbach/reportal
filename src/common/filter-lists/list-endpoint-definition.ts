import { FilterListState } from "../../components/filter-list/types";
import { FilterValue, ListSearchProps, ResponseField, SearchQueryDefinition, ServerFilter } from "./types";

export abstract class ListEndpointDefinition<T = any> {
  abstract readonly id: string;

  abstract readonly name: string;

  abstract readonly defaultData: FilterListState;

  abstract readonly responseFields: ResponseField[];

  abstract readonly serverFilters: ServerFilter[];

  abstract getSearchQueries(searchProps: ListSearchProps): SearchQueryDefinition;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clickAction(item: T) {}

  protected getFiltersAsMap(filters: FilterValue<ServerFilter>[]) {
    return filters.reduce<Record<string, FilterValue<ServerFilter>>>((acc, filter) => {
      acc[filter.filter.key] = filter;
      return acc;
    }, {});
  }
}
