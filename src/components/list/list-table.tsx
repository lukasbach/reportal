import React, { FC } from "react";
import { flexRender } from "@tanstack/react-table";
import { Box } from "@primer/react";
import { useListTable } from "./use-list-table";
import { tableStyles } from "./table-styles";
import { DataTableHead } from "./data-table-head";
import { useListContext } from "./list-context";

export const ListTable: FC<{}> = () => {
  const { data, endpoint, fields, onChangeFields } = useListContext();
  const table = useListTable(endpoint, fields, data);
  return (
    <Box as="table" sx={tableStyles.table}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Box as="tr" sx={tableStyles.tableRow} key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <DataTableHead header={header} table={table} key={header.id} />
            ))}
          </Box>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
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
          </tr>
        ))}
      </tbody>
    </Box>
  );
};
