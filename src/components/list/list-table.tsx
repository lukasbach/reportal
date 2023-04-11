import React, { FC } from "react";
import { flexRender } from "@tanstack/react-table";
import { Box } from "@primer/react";
import { useListTable } from "./use-list-table";
import { ListEndpointDefinition } from "../../list-endpoints/types";
import { tableStyles } from "./table-styles";
import { DataTableHead } from "./data-table-head";

export type ListTableProps = {
  endpoint: ListEndpointDefinition<any>;
  fields: string[];
  data: any[];
  onChangeFields: (fields: string[]) => void;
};

export const ListTable: FC<ListTableProps> = ({ data, endpoint, fields, onChangeFields }) => {
  const table = useListTable(endpoint, fields, data);
  return (
    <Box as="table" sx={tableStyles.table}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Box as="tr" sx={tableStyles.tableRow} key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <DataTableHead header={header} table={table} onChangeFields={onChangeFields} key={header.id} />
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
