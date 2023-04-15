import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { ParsedSearchResult } from "./search-utils";
import { ListEndpointDefinition } from "./types";
import { useAuthStore } from "../auth";
import { useFetchInitialPage } from "../components/filter-list/use-fetch-initial-page";
import { useRefCopy } from "../utils";

export const useFetchListItems = (
  endpoint: ListEndpointDefinition<any>,
  search: ParsedSearchResult | null,
  displayPageSize: number,
  loadingPageSize = 50
) => {
  const { kit: octokit } = useAuthStore();

  const queryFn = useMemo(
    () =>
      search
        ? endpoint.getSearchQueries({
            pageSize: loadingPageSize,
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
    [search, endpoint, loadingPageSize, octokit]
  );

  const { fetchNextPage, hasNextPage, isFetching, data, error } = useInfiniteQuery({
    queryKey: [endpoint.name, search?.searchTerms ?? "", search?.serverFilters ?? ""],
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
    return data.pages.flatMap((page) => page.result);
  }, [data]);

  const totalCount = useMemo(() => data?.pages[0]?.resultCount, [data]);
  const loadedCount = useMemo(() => list.length, [list]);

  const fetchUntil = useCallback(
    async (targetItemCount: number) => {
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
    },
    [isFetchingRef, loadedCount, totalCount, fetchNextPage]
  );

  useFetchInitialPage(search, displayPageSize, totalCount, fetchUntil);

  return { fetchNextPage, hasNextPage, isFetching, list, error, totalCount, loadedCount, fetchUntil };
};
