import { useCallback, useMemo, useState } from "react";
import { useDebouncedEffect } from "@react-hookz/web";

export const usePagination = (
  pageSize: number,
  totalItemCount: number,
  loadedItemCount: number,
  fetchUntil: (item: number) => Promise<void>
) => {
  const [page, setPage] = useState(0);
  const total = useMemo(
    () => (totalItemCount ? Math.ceil(totalItemCount / pageSize) : null),
    [pageSize, totalItemCount]
  );

  const hasNextPage = useMemo(() => (total ? page < total - 1 : true), [page, total]);
  const hasPreviousPage = useMemo(() => page > 0, [page]);

  const pageChange = useCallback(
    async (newPage: number) => {
      setPage(newPage);
      const toBeLoadedCount = (newPage + 1) * pageSize;
      if (toBeLoadedCount > loadedItemCount) {
        await fetchUntil(toBeLoadedCount);
      }
    },
    [fetchUntil, loadedItemCount, pageSize]
  );
  useDebouncedEffect(
    () => {
      fetchUntil((page + 1) * pageSize);
    },
    [pageSize],
    2000
  );

  const nextPage = useCallback(async () => {
    if (hasNextPage) {
      await pageChange(page + 1);
    }
  }, [hasNextPage, page, pageChange]);

  const previousPage = useCallback(async () => {
    if (hasPreviousPage) {
      await pageChange(page - 1);
    }
  }, [hasPreviousPage, page, pageChange]);

  const pagination = useMemo(() => {
    return {
      pageIndex: page,
      pageSize,
    };
  }, [page, pageSize]);

  return {
    page,
    pageSize,
    totalPages: total,
    pageChange,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    pagination,
  };
};
