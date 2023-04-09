import React, { FC, ReactNode } from "react";
import { flexRender } from "@tanstack/react-table";
import { Box } from "@primer/react";
import { BetterSystemStyleObject } from "@primer/react/lib/sx";
import { useListTable } from "./use-list-table";
import { ListEndpointDefinition } from "../../list-endpoints/types";

const baseStyles = {
  noWrap: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    minWidth: 0,
    display: "inline-block",
  },
} satisfies Record<string, BetterSystemStyleObject>;

const styles = {
  table: {
    width: "fit-content",
  },
  tableRow: { display: "flex", width: "fit-content" },
  tableHead: { position: "relative", ":hover .resize-handle": { opacity: 1 }, ...baseStyles.noWrap },
  resizeHandle: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    width: "8px",
    background: "rgba(0,0,0,0.5)",
    opacity: 0,
    cursor: "col-resize",
    "user-select": "none",
    "touch-action": "none",
  },
  resizeHandleActive: {
    background: "blue",
    opacity: 1,
  },
  cell: {
    ...baseStyles.noWrap,
  },
} satisfies Record<string, BetterSystemStyleObject>;

export type ListTableProps = {
  endpoint: ListEndpointDefinition<any>;
  fields: string[];
  data: any[];
};

export const ListTable: FC<ListTableProps> = ({ data, endpoint, fields }) => {
  const table = useListTable(endpoint, fields, data);
  return (
    <Box as="table" sx={styles.table}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Box as="tr" sx={styles.tableRow} key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Box
                as="th"
                key={header.id}
                style={{ width: header.getSize(), maxWidth: header.getSize() }}
                sx={styles.tableHead}
              >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                <Box
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className="resize-handle"
                  sx={{
                    ...styles.resizeHandle,
                    ...(header.column.getIsResizing() && styles.resizeHandleActive),
                  }}
                />
              </Box>
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
                sx={styles.cell}
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
