import React, { FC } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Box } from "@primer/react";
import { Column, flexRender, Header, RowData, Table } from "@tanstack/react-table";
import { tableStyles } from "./table-styles";
import { useListContext } from "../list/list-context";

export type DataTableHeadProps = {
  header: Header<RowData, unknown>;
  table: Table<RowData>;
};

const reorderColumn = (draggedColumnId: string, targetColumnId: string, columnOrder: string[]): string[] => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  );
  return [...columnOrder];
};

export const TableHead: FC<DataTableHeadProps> = ({ header, table }) => {
  const { fields, onChangeFields } = useListContext();
  const { column } = header;

  const [, dropRef] = useDrop({
    accept: "column",
    drop: (draggedColumn: Column<RowData>) => {
      const newColumnOrder = reorderColumn(draggedColumn.id, column.id, fields);
      onChangeFields(newColumnOrder);
    },
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: "column",
  });

  return (
    <Box
      as="th"
      ref={dropRef}
      key={header.id}
      style={{ width: header.getSize(), maxWidth: header.getSize() }}
      sx={tableStyles.tableHeadCell}
    >
      <div ref={previewRef}>
        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
        <span ref={dragRef}>drag</span>
      </div>
      <Box
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        className="resize-handle"
        sx={{
          ...tableStyles.resizeHandle,
          ...(header.column.getIsResizing() && tableStyles.resizeHandleActive),
        }}
      >
        <div />
      </Box>
    </Box>
  );
};
