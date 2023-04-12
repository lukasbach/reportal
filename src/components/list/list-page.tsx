import React, { FC, useState } from "react";
import { Box } from "@primer/react";
import { SearchInput } from "./search-input";
import { ParsedSearchResult } from "../../list-endpoints/search-utils";
import { ListEndpointDefinition } from "../../list-endpoints/types";
import { FieldSelector } from "./field-selector";
import { ListTable } from "../table/list-table";
import { useFetchListItems } from "../../list-endpoints/use-fetch-list-items";
import { ListProvider } from "./list-context";
import { usePagination } from "./use-pagination";
import { useCalcPageSize } from "./use-calc-page-size";

export type ListPageProps = {
  endpoint: ListEndpointDefinition<any>;
};

export const ListPage: FC<ListPageProps> = ({ endpoint }) => {
  const [search, setSearch] = useState<ParsedSearchResult>();
  const [fields, setFields] = useState<string[]>(endpoint.defaultFields);
  const [listContainerRef, itemsPerPage] = useCalcPageSize<HTMLDivElement>(37);
  const { list, loadedCount, totalCount, fetchUntil } = useFetchListItems(endpoint, search ?? null, itemsPerPage, 30);
  const { pagination, nextPage, previousPage, page, totalPages } = usePagination(
    itemsPerPage,
    totalCount,
    loadedCount,
    fetchUntil
  );

  return (
    <ListProvider onChangeFields={setFields} data={list} fields={fields} endpoint={endpoint}>
      <Box display="flex" flexDirection="column" overflow="auto" height="100%">
        <Box p={2}>
          <SearchInput endpoint={endpoint} onChange={setSearch} value={search} />
          <FieldSelector endpoint={endpoint} fields={fields} setFields={setFields} />
        </Box>
        <Box flexGrow={1} overflow="auto">
          <ListTable
            pagination={pagination}
            pageCount={Math.floor(totalCount / itemsPerPage)}
            scrollRef={listContainerRef}
          />
        </Box>
        <Box p={2}>
          {loadedCount}/{totalCount}
          <button onClick={() => fetchUntil(loadedCount + 10)}>Fetch next</button>
          <button onClick={nextPage}>Next</button>
          <button onClick={previousPage}>Previous</button>
          Page {page} of {totalPages}
        </Box>
      </Box>
    </ListProvider>
  );
};
