import { useEffect, useRef } from "react";
import { ParsedSearchResult } from "../../list-endpoints/search-utils";

export const useFetchInitialPage = (
  search: ParsedSearchResult | null,
  pageSize: number,
  totalItems: number,
  fetchUntil: (item: number) => Promise<void>
) => {
  const done = useRef(false);

  useEffect(() => {
    done.current = false;
  }, [search]);

  useEffect(() => {
    if (done.current) {
      return;
    }

    if (!totalItems || !pageSize) {
      return;
    }

    console.log("initial load", pageSize, totalItems);
    fetchUntil(pageSize);

    done.current = true;
  }, [pageSize, totalItems, fetchUntil]);
};
