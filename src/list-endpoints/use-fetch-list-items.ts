import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { ParsedSearchResult } from "./search-utils";
import { ListEndpointDefinition } from "./types";
import { useAuthStore } from "../auth";

export const useFetchListItems = (
  endpoint: ListEndpointDefinition<any>,
  search: ParsedSearchResult | null,
  pageSize = 50
) => {
  const { kit: octokit } = useAuthStore();

  const queryFn = useMemo(
    () =>
      search
        ? endpoint.getSearchQueries({
            pageSize,
            octokit,
            searchStrings: search.searchTerms,
            filters: search.serverFilters,
          })
        : async () => ({
            result: [],
            hasNextPage: false,
            hasPreviousPage: false,
            endCursor: "",
            startCursor: "",
            resultCount: 0,
          }),
    [search, endpoint, pageSize, octokit]
  );

  const { fetchNextPage, hasNextPage, isFetching, data, error } = useInfiniteQuery({
    queryKey: [endpoint.name, search?.searchTerms ?? "", search?.serverFilters ?? ""],
    queryFn,
    getNextPageParam: (page: any) => (page.hasNextPage ? page.endCursor : undefined),
    getPreviousPageParam: (page) => (page.hasPreviousPage ? page.startCursor : undefined),
    refetchOnWindowFocus: false,
  });

  const list = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.pages.flatMap((page) => page.result);
  }, [data]);

  const totalCount = useMemo(() => data?.pages[0]?.resultCount, [data]);
  const loadedCount = useMemo(() => list.length, [list]);

  const fetchUntil = useCallback(
    async (targetItemCount: number) => {
      let i = loadedCount;
      while (i < targetItemCount) {
        const result = await fetchNextPage();
        const pages = result.data?.pages ?? [];
        i = pages.reduce((acc, page) => acc + page.resultCount, 0) ?? i;
      }
    },
    [fetchNextPage, loadedCount]
  );

  return { fetchNextPage, hasNextPage, isFetching, list, error, totalCount, loadedCount, fetchUntil };
};
