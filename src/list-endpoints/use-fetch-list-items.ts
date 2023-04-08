import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { ParsedSearchResult } from "./search-utils";
import { ListEndpointDefinition, SearchQueryDefinition } from "./types";
import { useAuthStore } from "../auth";

export const useFetchListItems = (
  endpoint: ListEndpointDefinition<any>,
  search: ParsedSearchResult,
  pageSize = 100
) => {
  const { kit: octokit } = useAuthStore();

  const queryFn = useMemo(
    () =>
      endpoint.getSearchQueries({
        pageSize,
        octokit,
        searchStrings: search.searchTerms,
        filters: search.serverFilters,
      }).queryFn,
    [pageSize, octokit, search.searchTerms, search.serverFilters]
  );

  const { fetchNextPage, hasNextPage, isFetching, data, error } = useInfiniteQuery({
    queryKey: [endpoint.name, search.searchTerms, search.serverFilters],
    queryFn,
    getNextPageParam: (page: any) => (page.hasNextPage ? page.endCursor : undefined),
    getPreviousPageParam: (page) => (page.hasPreviousPage ? page.startCursor : undefined),
    refetchOnWindowFocus: false,
  });

  console.log("data", data);
  console.log("error", error);

  const list = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.pages.flatMap((page) => page.result);
  }, [data]);

  return { fetchNextPage, hasNextPage, isFetching, list, error };
};
