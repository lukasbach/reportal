import { useRef, useState } from "react";
import { ParsedSearchResult, parseSearch } from "../../common/filter-lists/search-utils";
import { useCalcPageSize } from "./use-calc-page-size";
import { useFetchListItems } from "../../common/filter-lists/use-fetch-list-items";
import { usePagination } from "./use-pagination";
import { getEndpoint } from "../../list-endpoints/endpoints";
import { ColumnSizing, FilterListState } from "./types";

export const useListState = (data: FilterListState) => {
  const endpoint = getEndpoint(data.endpointId);
  const [search, setSearch] = useState<ParsedSearchResult>(parseSearch(data.search, endpoint));
  const colSizing = useRef<ColumnSizing>({});
  const [fields, setFields] = useState<string[]>(data.fields);
  const [listContainerRef, itemsPerPage] = useCalcPageSize<HTMLDivElement>(37);
  const fetchData = useFetchListItems(endpoint, search ?? null, itemsPerPage, 30);
  const pagination = usePagination(itemsPerPage, fetchData.totalCount, fetchData.loadedCount, fetchData.fetchUntil);

  return {
    search,
    setSearch,
    colSizing,
    fields,
    setFields,
    listContainerRef,
    pagination,
    fetchData,
    itemsPerPage,
    endpoint,
  };
};
