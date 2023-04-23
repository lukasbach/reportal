import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { filterByClientFilters, ParsedSearchResult } from "./search-utils";
import { useFetchInitialPage } from "../../components/filter-list/use-fetch-initial-page";
import { useRefCopy, useStableHandler } from "../../utils";
import { useEndpointQueryFn } from "./use-endpoint-query-fn";
import { ListEndpointDefinition } from "./list-endpoint-definition";

export const useFetchListItems = (
  endpoint: ListEndpointDefinition<any>,
  search: ParsedSearchResult | null,
  displayPageSize: number,
  loadingPageSize = 50
) => {
  const queryFn = useEndpointQueryFn(search, loadingPageSize, endpoint);

  const { fetchNextPage, hasNextPage, isFetching, data, error } = useInfiniteQuery({
    queryKey: ["infinite-fetch", endpoint.name, search?.searchTerms ?? "", search?.serverFilters ?? ""],
    queryFn,
    getNextPageParam: (page: any) => (page.hasNextPage ? page.endCursor : undefined),
    getPreviousPageParam: (page) => (page.hasPreviousPage ? page.startCursor : undefined),
    refetchOnWindowFocus: false,
  });

  const isFetchingRef = useRefCopy(isFetching);

  const list = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.pages.flatMap((page) => page.result).filter((item) => filterByClientFilters(item, search));
  }, [data, search]);

  const totalCount = useMemo(() => data?.pages[0]?.resultCount, [data]);
  const loadedCount = useMemo(() => list.length, [list]);

  const fetchUntil = useStableHandler(async (targetItemCount: number) => {
    while (isFetchingRef.current) {
      await new Promise<void>((r) => {
        setTimeout(r, 100);
      });
    }

    let i = loadedCount;
    while (i < targetItemCount) {
      if (!hasNextPage) {
        return;
      }

      if (i >= totalCount /* || !totalCount */) {
        return;
      }

      const result = await fetchNextPage();
      const pages = result.data?.pages ?? [];
      i = pages.reduce((acc, page) => acc + page.result.length, 0) ?? i;
    }
  });

  useFetchInitialPage(search, displayPageSize, totalCount, fetchUntil);

  return { fetchNextPage, hasNextPage, isFetching, list, error, totalCount, loadedCount, fetchUntil };
};
