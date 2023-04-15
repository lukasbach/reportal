import React, { FC, useMemo, useRef } from "react";
import { Box, ButtonGroup, IconButton } from "@primer/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";
import { parseSearch } from "../../list-endpoints/search-utils";
import { ListTable } from "../table/list-table";
import { useFetchListItems } from "../../list-endpoints/use-fetch-list-items";
import { FilterListProvider } from "./filter-list-context";
import { usePagination } from "./use-pagination";
import { useCalcPageSize } from "./use-calc-page-size";
import { useTriggerPersist } from "./use-trigger-persist";
import { FilterListState } from "./types";
import { getEndpoint } from "../../list-endpoints/endpoints";

export type FilterListEmbeddedContainerProps = {
  data: FilterListState;
  onChangeColSizing: (id: string, sizing: Record<string, number>) => void;
  id: string;
};

export const FilterListEmbeddedContainer: FC<FilterListEmbeddedContainerProps> = ({ data, onChangeColSizing, id }) => {
  const endpoint = getEndpoint(data.endpointId);
  const search = useMemo(() => parseSearch(data.search, endpoint), [data.search, endpoint]);
  const colSizing = useRef<Record<string, number>>({});
  const [listContainerRef, itemsPerPage] = useCalcPageSize<HTMLDivElement>(37);
  const { list, loadedCount, totalCount, fetchUntil } = useFetchListItems(endpoint, search ?? null, itemsPerPage, 30);
  const { pagination, nextPage, previousPage, page, totalPages } = usePagination(
    itemsPerPage,
    totalCount,
    loadedCount,
    fetchUntil
  );

  const markDirty = useTriggerPersist<Record<string, number>>(id, onChangeColSizing, colSizing.current);

  return (
    <FilterListProvider onChangeFields={() => {}} data={list} fields={data.fields} endpoint={endpoint}>
      <Box display="flex" flexDirection="column" overflow="auto" height="100%">
        <Box flexGrow={1} overflow="auto">
          <ListTable
            pagination={pagination}
            pageCount={Math.floor(totalCount / itemsPerPage)}
            scrollRef={listContainerRef}
            onChangeColumnSizing={(c) => {
              colSizing.current = c;
              markDirty();
            }}
          />
        </Box>
        <Box p={2} color="fg.subtle" fontSize={1} display="flex" justifyContent="flex-end" alignItems="center">
          {totalCount ? `${totalCount} items. ` : ""}Page {page + 1}
          {totalPages ? ` of ${totalPages}` : ""}.
          <ButtonGroup sx={{ ml: 2 }}>
            <IconButton
              onClick={previousPage}
              disabled={!previousPage}
              aria-label="Previous Page"
              icon={ChevronLeftIcon}
            />
            <IconButton onClick={nextPage} disabled={!nextPage} aria-label="Next Page" icon={ChevronRightIcon} />
          </ButtonGroup>
        </Box>
      </Box>
    </FilterListProvider>
  );
};
