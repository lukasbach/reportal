import React, { FC, MutableRefObject } from "react";
import { flexRender, PaginationState } from "@tanstack/react-table";
import { Box } from "@primer/react";
import { useListTable } from "./use-list-table";
import { tableStyles } from "./table-styles";
import { TableHead } from "./table-head";
import { useListContext } from "../list/list-context";

export type ListTableProps = {
  pagination: PaginationState;
  pageCount: number;
  scrollRef: MutableRefObject<any>;
};

export const ListTable: FC<ListTableProps> = ({ pagination, pageCount, scrollRef }) => {
  const table = useListTable(pagination, pageCount);
  return (
    <Box as="table" sx={tableStyles.table}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Box as="tr" sx={tableStyles.headerGroup} key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead header={header} table={table} key={header.id} />
            ))}
          </Box>
        ))}
      </thead>
      <Box as="tbody" sx={tableStyles.tableBody} ref={scrollRef}>
        {table.getRowModel().rows.map((row) => (
          <Box as="tr" key={row.id} sx={tableStyles.row}>
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
      </Box>
    </Box>
  );
};
