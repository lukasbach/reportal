import React, { FC, RefObject } from "react";
import { Box, ButtonGroup, IconButton } from "@primer/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";
import { createPortal } from "react-dom";
import { ListTable } from "../table/list-table";
import { FilterListProvider } from "./filter-list-context";
import { useTriggerPersist } from "../../common/use-trigger-persist";
import { ColumnSizing, FilterListState } from "./types";
import { getEndpoint } from "../../list-endpoints/endpoints";
import { useListState } from "./use-list-state";
import { useListTable } from "../table/use-list-table";

export type FilterListEmbeddedContainerProps = {
  data: FilterListState;
  onChangeColSizing: (id: string, sizing: ColumnSizing) => void;
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

  const listState = useListState(data);
  const { colSizing, listContainerRef, fetchData, pagination } = listState;

  const markDirty = useTriggerPersist<ColumnSizing>(id, onChangeColSizing, colSizing.current);

  const { table } = useListTable(
    listState,
    fetchData.list,
    (state) => {
      colSizing.current = state;
      markDirty();
    },
    true
  );

  return (
    <FilterListProvider onChangeFields={() => {}} data={fetchData.list} fields={data.fields} endpoint={endpoint}>
      <ListTable
        scrollRef={listContainerRef}
        expandItems={pagination.hasNextPage && !fetchData.isFetching}
        canSelect={false}
        table={table}
      />
      {actionsRef.current &&
        createPortal(
          <Box mr={1} color="fg.subtle" fontSize={1} display="flex" justifyContent="flex-end" alignItems="center">
            {pagination.page + 1}
            {pagination.totalPages ? `/${pagination.totalPages}` : ""}
            <ButtonGroup sx={{ ml: 2 }}>
              <IconButton
                onClick={pagination.previousPage}
                disabled={!pagination.previousPage}
                aria-label="Previous Page"
                icon={ChevronLeftIcon}
                size="small"
              />
              <IconButton
                onClick={pagination.nextPage}
                disabled={!pagination.nextPage}
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
