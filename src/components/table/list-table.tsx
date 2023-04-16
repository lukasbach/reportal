import React, { FC, MutableRefObject } from "react";
import { flexRender, Table } from "@tanstack/react-table";
import { Box, Checkbox } from "@primer/react";
import { tableStyles } from "./table-styles";
import { TableHead } from "./table-head";

export type ListTableProps = {
  scrollRef: MutableRefObject<any>;
  expandItems: boolean;
  canSelect?: boolean;
  table: Table<any>;
  onClickRow?: (item: any) => void;
};

export const ListTable: FC<ListTableProps> = ({ scrollRef, expandItems, onClickRow, canSelect, table }) => {
  return (
    <Box as="table" sx={tableStyles.table}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Box as="tr" sx={tableStyles.headerGroup} key={headerGroup.id}>
            {canSelect && <Box as="th" sx={tableStyles.checkboxCell} />}
            {headerGroup.headers.map((header) => (
              <TableHead header={header} table={table} key={header.id} />
            ))}
          </Box>
        ))}
      </thead>
      <Box as="tbody" sx={tableStyles.tableBody} ref={scrollRef}>
        {table.getRowModel().rows.map((row) => (
          <Box as="tr" key={row.id} sx={tableStyles.row} onClick={() => onClickRow?.(row.original)}>
            {canSelect && (
              <Box as="td" sx={tableStyles.checkboxCell} className="checkbox-cell">
                <Checkbox
                  sx={tableStyles.checkbox}
                  checked={row.getIsSelected()}
                  onChange={(e) => row.toggleSelected(e.currentTarget.checked)}
                />
              </Box>
            )}
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
