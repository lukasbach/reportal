import React, { FC, RefObject, useMemo, useRef } from "react";
import { Box, ButtonGroup, IconButton } from "@primer/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";
import { createPortal } from "react-dom";
import { parseSearch } from "../../list-endpoints/search-utils";
import { ListTable } from "../table/list-table";
import { useFetchListItems } from "../../list-endpoints/use-fetch-list-items";
import { FilterListProvider } from "./filter-list-context";
import { usePagination } from "./use-pagination";
import { useCalcPageSize } from "./use-calc-page-size";
import { useTriggerPersist } from "../../common/use-trigger-persist";
import { FilterListState } from "./types";
import { getEndpoint } from "../../list-endpoints/endpoints";

export type FilterListEmbeddedContainerProps = {
  data: FilterListState;
  onChangeColSizing: (id: string, sizing: Record<string, number>) => void;
  id: string;
  actionsRef: RefObject<HTMLDivElement>;
};

export const FilterListEmbeddedContainer: FC<FilterListEmbeddedContainerProps> = ({
  data,
  onChangeColSizing,
  id,
  actionsRef,
}) => {
  const endpoint = getEndpoint(data.endpointId);
  const search = useMemo(() => parseSearch(data.search, endpoint), [data.search, endpoint]);
  const colSizing = useRef<Record<string, number>>({});
  const [listContainerRef, itemsPerPage] = useCalcPageSize<HTMLDivElement>(37);
  const { list, loadedCount, totalCount, fetchUntil, isFetching } = useFetchListItems(
    endpoint,
    search ?? null,
    itemsPerPage,
    30
  );
  const { pagination, nextPage, previousPage, page, totalPages, hasNextPage } = usePagination(
    itemsPerPage,
    totalCount,
    loadedCount,
    fetchUntil
  );

  const markDirty = useTriggerPersist<Record<string, number>>(id, onChangeColSizing, colSizing.current);

  return (
    <FilterListProvider onChangeFields={() => {}} data={list} fields={data.fields} endpoint={endpoint}>
      <ListTable
        expandItems={hasNextPage && !isFetching}
        pagination={pagination}
        pageCount={Math.floor(totalCount / itemsPerPage)}
        scrollRef={listContainerRef}
        onChangeColumnSizing={(c) => {
          colSizing.current = c;
          markDirty();
        }}
      />
      {actionsRef.current &&
        createPortal(
          <Box mr={1} color="fg.subtle" fontSize={1} display="flex" justifyContent="flex-end" alignItems="center">
            {page + 1}
            {totalPages ? `/${totalPages}` : ""}
            <ButtonGroup sx={{ ml: 2 }}>
              <IconButton
                onClick={previousPage}
                disabled={!previousPage}
                aria-label="Previous Page"
                icon={ChevronLeftIcon}
                size="small"
              />
              <IconButton
                onClick={nextPage}
                disabled={!nextPage}
                aria-label="Next Page"
                icon={ChevronRightIcon}
                size="small"
              />
            </ButtonGroup>
          </Box>,
          actionsRef.current
        )}
    </FilterListProvider>
  );
};
