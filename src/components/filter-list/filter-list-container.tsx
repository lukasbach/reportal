import React, { FC, useEffect, useState } from "react";
import { Box, ButtonGroup, IconButton } from "@primer/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";
import { ListTable } from "../table/list-table";
import { FilterListProvider } from "./filter-list-context";
import { useTriggerPersist } from "../../common/use-trigger-persist";
import { FilterListState } from "./types";
import { getEndpoint } from "../../list-endpoints/endpoints";
import { FilterListHeader } from "./filter-list-header";
import { useListState } from "./use-list-state";

export type FilterListPageProps = {
  data: FilterListState;
  onUpdate: (id: string, data: FilterListState) => void;
  id: string;
  embedded?: boolean;
  actions?: JSX.Element;
};

export const FilterListContainer: FC<FilterListPageProps> = ({ data, onUpdate, id, actions, embedded }) => {
  const endpoint = getEndpoint(data.endpointId);
  const [name, setName] = useState(data.name);
  const [pinned, setPinned] = useState(data.pinned);

  const { itemsPerPage, search, setSearch, colSizing, fields, setFields, listContainerRef, fetchData, pagination } =
    useListState(data);

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
    <FilterListProvider onChangeFields={setFields} data={fetchData.list} fields={fields} endpoint={endpoint}>
      <Box display="flex" flexDirection="column" overflow="auto" height="100%">
        <Box p={2}>
          <FilterListHeader
            name={name}
            setName={setName}
            data={data}
            search={search}
            setSearch={setSearch}
            pinned={pinned}
            setPinned={setPinned}
            fields={fields}
            setFields={setFields}
            isFetching={fetchData.isFetching}
            embedded={embedded}
          />
        </Box>
        <Box flexGrow={1} overflow="auto">
          <ListTable
            expandItems={pagination.hasNextPage && !fetchData.isFetching}
            pagination={pagination.pagination}
            pageCount={Math.floor(fetchData.totalCount / itemsPerPage)}
            scrollRef={listContainerRef}
            onChangeColumnSizing={(c) => {
              colSizing.current = c;
              markDirty();
            }}
            onChangeSelection={console.log}
          />
        </Box>
        <Box p={2} color="fg.subtle" fontSize={1} display="flex" justifyContent="flex-end" alignItems="center">
          {fetchData.totalCount ? `${fetchData.totalCount} items. ` : ""}Page {pagination.page + 1}
          {pagination.totalPages ? ` of ${pagination.totalPages}` : ""}.
          <ButtonGroup sx={{ ml: 2 }}>
            <IconButton
              onClick={pagination.previousPage}
              disabled={!pagination.previousPage}
              aria-label="Previous Page"
              icon={ChevronLeftIcon}
            />
            <IconButton
              onClick={pagination.nextPage}
              disabled={!pagination.nextPage}
              aria-label="Next Page"
              icon={ChevronRightIcon}
            />
          </ButtonGroup>
          {actions}
        </Box>
      </Box>
    </FilterListProvider>
  );
};
