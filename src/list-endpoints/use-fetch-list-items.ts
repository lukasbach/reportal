import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
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
        : async () => ({ result: [], hasNextPage: false, hasPreviousPage: false, endCursor: "", startCursor: "" }),
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

  return { fetchNextPage, hasNextPage, isFetching, list, error };
};
