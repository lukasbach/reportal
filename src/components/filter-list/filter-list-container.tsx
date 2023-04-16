import React, { FC, useEffect, useRef, useState } from "react";
import { Box, ButtonGroup, IconButton } from "@primer/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";
import { SearchInput } from "./search-input";
import { ParsedSearchResult, parseSearch } from "../../list-endpoints/search-utils";
import { FieldSelector } from "./field-selector";
import { ListTable } from "../table/list-table";
import { useFetchListItems } from "../../list-endpoints/use-fetch-list-items";
import { FilterListProvider } from "./filter-list-context";
import { usePagination } from "./use-pagination";
import { useCalcPageSize } from "./use-calc-page-size";
import { useTriggerPersist } from "../../common/use-trigger-persist";
import { FilterListState } from "./types";
import { getEndpoint } from "../../list-endpoints/endpoints";

export type FilterListPageProps = {
  data: FilterListState;
  onUpdate: (id: string, data: FilterListState) => void;
  id: string;
  embedded?: boolean;
  actions?: JSX.Element;
};

export const FilterListContainer: FC<FilterListPageProps> = ({ data, onUpdate, id, actions }) => {
  const endpoint = getEndpoint(data.endpointId);
  const [name, setName] = useState(data.name);
  const [pinned, setPinned] = useState(data.pinned);
  const [search, setSearch] = useState<ParsedSearchResult>(parseSearch(data.search, endpoint));
  const colSizing = useRef<Record<string, number>>({});
  const [fields, setFields] = useState<string[]>(data.fields);
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

  const markDirty = useTriggerPersist<FilterListState>(id, onUpdate, {
    endpointId: endpoint.id,
    search: search?.search ?? "",
    fields,
    fieldWidths: colSizing.current,
    pinned,
    name,
  });

  useEffect(markDirty, [markDirty, endpoint.name, search, fields]);

  return (
    <FilterListProvider onChangeFields={setFields} data={list} fields={fields} endpoint={endpoint}>
      <Box display="flex" flexDirection="column" overflow="auto" height="100%">
        <Box p={2}>
          <SearchInput endpoint={endpoint} onChange={setSearch} value={search} isLoading={isFetching} />
          <FieldSelector endpoint={endpoint} fields={fields} setFields={setFields} />
        </Box>
        <Box flexGrow={1} overflow="auto">
          <ListTable
            hasNextPage={hasNextPage}
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
          {actions}
        </Box>
      </Box>
    </FilterListProvider>
  );
};
