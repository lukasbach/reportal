import { FilterListState } from "../../components/filter-list/types";
import { FilterValue, ListSearchProps, OrderByOption, SearchQueryDefinition, ListField } from "./types";
import { ParsedSearchResult } from "./search-utils";
import { ListFieldBuilder } from "./list-field-builder";

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
        description: "Choose a field to order by. Ordering is applied server-side by github.",
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

  protected f(key: string, name: string) {
    return new ListFieldBuilder(key, name);
  }
}
