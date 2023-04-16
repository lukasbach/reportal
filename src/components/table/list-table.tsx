import React, { FC, MutableRefObject } from "react";
import { flexRender, PaginationState } from "@tanstack/react-table";
import { Box, Checkbox } from "@primer/react";
import { useListTable } from "./use-list-table";
import { tableStyles } from "./table-styles";
import { TableHead } from "./table-head";

export type ListTableProps = {
  pagination: PaginationState;
  pageCount: number;
  scrollRef: MutableRefObject<any>;
  onChangeColumnSizing?: (state: Record<string, number>) => void;
  expandItems: boolean;
};

export const ListTable: FC<ListTableProps> = ({
  pagination,
  pageCount,
  scrollRef,
  onChangeColumnSizing,
  expandItems,
}) => {
  const table = useListTable(pagination, pageCount, onChangeColumnSizing);
  return (
    <Box as="table" sx={tableStyles.table}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Box as="tr" sx={tableStyles.headerGroup} key={headerGroup.id}>
            <Box as="th" sx={tableStyles.checkboxCell} />
            {headerGroup.headers.map((header) => (
              <TableHead header={header} table={table} key={header.id} />
            ))}
          </Box>
        ))}
      </thead>
      <Box as="tbody" sx={tableStyles.tableBody} ref={scrollRef}>
        {table.getRowModel().rows.map((row) => (
          <Box as="tr" key={row.id} sx={tableStyles.row}>
            <Box as="td" sx={tableStyles.checkboxCell} className="checkbox-cell">
              <Checkbox sx={tableStyles.checkbox} />
            </Box>
            {row.getVisibleCells().map((cell) => (
              <Box
                as="td"
                key={cell.id}
                style={{ width: cell.column.getSize(), maxWidth: cell.column.getSize() }}
                sx={tableStyles.cell}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Box>
            ))}
          </Box>
        ))}
        {/* important so that row items don't expand over the entire list */}
        {!expandItems && <div />}
      </Box>
    </Box>
  );
};
