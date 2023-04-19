import { useMemo } from "react";
import { ParsedSearchResult } from "./search-utils";

import { ListEndpointDefinition } from "./list-endpoint-definition";
import { useOctokit } from "../../auth/hooks";

export const useEndpointQueryFn = (
  search: ParsedSearchResult | null,
  loadingPageSize: number,
  endpoint: ListEndpointDefinition | null
) => {
  const octokit = useOctokit();
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
