import React, { FC, useEffect, useRef, useState } from "react";
import { Box, ButtonGroup, IconButton } from "@primer/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";
import { SearchInput } from "./search-input";
import { ParsedSearchResult, parseSearch } from "../../list-endpoints/search-utils";
import { ListEndpointDefinition } from "../../list-endpoints/types";
import { FieldSelector } from "./field-selector";
import { ListTable } from "../table/list-table";
import { useFetchListItems } from "../../list-endpoints/use-fetch-list-items";
import { FilterListProvider } from "./filter-list-context";
import { usePagination } from "./use-pagination";
import { useCalcPageSize } from "./use-calc-page-size";
import { useTriggerPersist } from "./use-trigger-persist";
import { FilterListState } from "./types";
import { IssueSearchEndpoint } from "../../list-endpoints/issue-search-endpoint";

export type FilterListPageProps = {
  data: FilterListState;
  onUpdate: (data: FilterListState) => void;
};

export const FilterListContainer: FC<FilterListPageProps> = ({ data, onUpdate }) => {
  const [endpoint] = useState(new IssueSearchEndpoint());
  const [name, setName] = useState(data.name);
  const [pinned, setPinned] = useState(data.pinned);
  const [search, setSearch] = useState<ParsedSearchResult>(parseSearch(data.search, endpoint));
  const colSizing = useRef<Record<string, number>>({});
  const [fields, setFields] = useState<string[]>(endpoint.defaultFields);
  const [listContainerRef, itemsPerPage] = useCalcPageSize<HTMLDivElement>(37);
  const { list, loadedCount, totalCount, fetchUntil, isFetching } = useFetchListItems(
    endpoint,
    search ?? null,
    itemsPerPage,
    30
  );
  const { pagination, nextPage, previousPage, page, totalPages } = usePagination(
    itemsPerPage,
    totalCount,
    loadedCount,
    fetchUntil
  );

  const markDirty = useTriggerPersist<FilterListState>(
    () => ({
      endpointId: endpoint.name,
      search: search?.search ?? "",
      fields,
      fieldWidths: colSizing.current,
      pinned,
      name,
    }),
    onUpdate
  );

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
          {totalCount} items. Page {page + 1} of {totalPages}.
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
