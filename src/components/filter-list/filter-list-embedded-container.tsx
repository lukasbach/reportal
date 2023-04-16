import React, { FC, RefObject } from "react";
import { Box, ButtonGroup, IconButton } from "@primer/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";
import { createPortal } from "react-dom";
import { ListTable } from "../table/list-table";
import { FilterListProvider } from "./filter-list-context";
import { useTriggerPersist } from "../../common/use-trigger-persist";
import { FilterListState } from "./types";
import { getEndpoint } from "../../list-endpoints/endpoints";
import { useListState } from "./use-list-state";

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
  const { itemsPerPage, colSizing, listContainerRef, fetchData, pagination } = useListState(data);
  const markDirty = useTriggerPersist<Record<string, number>>(id, onChangeColSizing, colSizing.current);

  return (
    <FilterListProvider onChangeFields={() => {}} data={fetchData.list} fields={data.fields} endpoint={endpoint}>
      <ListTable
        expandItems={pagination.hasNextPage && !fetchData.isFetching}
        pagination={pagination.pagination}
        pageCount={Math.floor(fetchData.totalCount / itemsPerPage)}
        scrollRef={listContainerRef}
        onChangeColumnSizing={(c) => {
          colSizing.current = c;
          markDirty();
        }}
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
