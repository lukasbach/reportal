import React, { FC } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Box } from "@primer/react";
import { Column, flexRender, Header, RowData } from "@tanstack/react-table";
import { GrabberIcon } from "@primer/octicons-react";
import { tableStyles } from "./table-styles";
import { useFilterListContext } from "../filter-list/filter-list-context";

export type DataTableHeadProps = {
  header: Header<RowData, unknown>;
};

const reorderColumn = (draggedColumnId: string, targetColumnId: string, columnOrder: string[]): string[] => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  );
  return [...columnOrder];
};

export const TableHead: FC<DataTableHeadProps> = ({ header }) => {
  const { fields, onChangeFields } = useFilterListContext();
  const { column } = header;

  const [{ isOver }, dropRef] = useDrop({
    collect: (monitor) => ({ isOver: monitor.isOver() }),
    accept: "column",
    drop: (draggedColumn: Column<RowData>) => {
      const newColumnOrder = reorderColumn(draggedColumn.id, column.id, fields);
      onChangeFields(newColumnOrder);
    },
  });

  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars
  const [_, dragRef] = useDrag({
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
      sx={{ ...tableStyles.tableHeadCell, ...(isOver && tableStyles.tableHeadCellDropping) }}
    >
      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
      <Box as="span" sx={tableStyles.grabber} ref={dragRef} className="grab-handle">
        <GrabberIcon size={16} />
      </Box>
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
