import React, { useEffect, useMemo, useState } from "react";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { resolveRecursiveSubitem } from "../../utils";
import { useListState } from "../filter-list/use-list-state";
import { ColumnSizing, RowSelection } from "../filter-list/types";

export const useListTable = (
  { fields, pagination: { pagination }, endpoint, fetchData, itemsPerPage, colSizing }: ReturnType<typeof useListState>,
  data: any[],
  onChangeColumnSizing?: () => void,
  canSelect = false
) => {
  const [columnSizing, setColumnSizing] = useState<ColumnSizing>(colSizing.current);
  const [rowSelection, setRowSelection] = useState<RowSelection>({});

  // eslint-disable-next-line no-param-reassign
  colSizing.current = columnSizing;

  useEffect(() => {
    onChangeColumnSizing?.();
  }, [columnSizing, onChangeColumnSizing]);

  const columnConfig = useMemo(() => {
    const columnHelper = createColumnHelper();
    return fields.map((field) => {
      const fieldDef = endpoint.responseFields.find((responseField) => responseField.jsonKey === field);
      return columnHelper.accessor(
        (row) => {
          const value = resolveRecursiveSubitem(row, field);
          return fieldDef?.renderCell ? fieldDef.renderCell(value, row) : value;
        },
        {
          id: field,
          cell: (info) => info.getValue(),

          header: () => <span>{fieldDef?.name}</span>,
        }
      );
    });
  }, [endpoint.responseFields, fields]);

  const pageCount = Math.floor(fetchData.totalCount / itemsPerPage);

  const slicedData = useMemo(
    () => data.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    [data, pagination.pageIndex, pagination.pageSize]
  );

  const table = useReactTable({
    data: slicedData,
    columns: columnConfig,
    getCoreRowModel: getCoreRowModel(),

    enableMultiRowSelection: canSelect,
    onRowSelectionChange: setRowSelection,

    columnResizeMode: "onChange",
    onColumnSizingChange: setColumnSizing,

    manualPagination: true,
    pageCount,
    state: { pagination, rowSelection, columnSizing },
  });
  return { table, rowSelection };
};
