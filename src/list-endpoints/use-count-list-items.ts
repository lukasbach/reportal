import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ParsedSearchResult } from "./search-utils";
import { ListEndpointDefinition } from "./types";
import { useEndpointQueryFn } from "./use-endpoint-query-fn";

export const useCountListItems = (endpoint: ListEndpointDefinition | null, search: ParsedSearchResult | null) => {
  const queryFn = useEndpointQueryFn(search, 0, endpoint);

  const { data } = useQuery({
    queryKey: ["count", endpoint?.name, search?.searchTerms ?? "", search?.serverFilters ?? ""],
    queryFn,
    refetchOnWindowFocus: false,
  });

  return useMemo(() => data?.resultCount, [data]);
};
