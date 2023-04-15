import { useMemo } from "react";
import { useAuthStore } from "../auth";
import { ParsedSearchResult } from "./search-utils";
import { ListEndpointDefinition } from "./types";

export const useEndpointQueryFn = (
  search: ParsedSearchResult | null,
  loadingPageSize: number,
  endpoint: ListEndpointDefinition | null
) => {
  const { kit: octokit } = useAuthStore();
  return useMemo(
    () =>
      search && endpoint
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
};
