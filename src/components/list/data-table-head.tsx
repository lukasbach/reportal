import React, { FC } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Box } from "@primer/react";
import { Column, flexRender, Header, RowData, Table } from "@tanstack/react-table";
import { tableStyles } from "./table-styles";

export type DataTableHeadProps = {
  header: Header<RowData, unknown>;
  table: Table<RowData>;
  onChangeFields: (fields: string[]) => void;
};

const reorderColumn = (draggedColumnId: string, targetColumnId: string, columnOrder: string[]): string[] => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  );
  return [...columnOrder];
};

export const DataTableHead: FC<DataTableHeadProps> = ({ header, table, onChangeFields }) => {
  const { getState, setColumnOrder } = table;
  const { columnOrder } = getState();
  const { column } = header;

  const [, dropRef] = useDrop({
    accept: "column",
    drop: (draggedColumn: Column<RowData>) => {
      console.log("drop", draggedColumn);
      const newColumnOrder = reorderColumn(draggedColumn.id, column.id, columnOrder);
      onChangeFields(newColumnOrder);
    },
    hover: console.log,
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: "column",
    end: console.log,
  });

  console.log(isDragging, column);

  return (
    <Box
      as="th"
      ref={dropRef}
      key={header.id}
      style={{ width: header.getSize(), maxWidth: header.getSize() }}
      sx={tableStyles.tableHead}
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
      />
    </Box>
  );
};
