import React, { useMemo } from "react";
import { createColumnHelper, getCoreRowModel, PaginationState, useReactTable } from "@tanstack/react-table";
import { resolveRecursiveSubitem } from "../../utils";
import { useFilterListContext } from "../filter-list/filter-list-context";

export const useListTable = (
  pagination: PaginationState,
  pageCount: number,
  onChangeColumnSizing?: (state: Record<string, number>) => void
) => {
  const { data, endpoint, fields } = useFilterListContext();
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

  const slicedData = useMemo(
    () => data.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    [data, pagination.pageIndex, pagination.pageSize]
  );

  const table = useReactTable({
    data: slicedData,
    columns: columnConfig,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",

    onColumnSizingChange: (updaterOrValue) => {
      const updater = <T,>(input: T): T =>
        typeof updaterOrValue === "function" ? (updaterOrValue as (input: T) => T)(input) : (updaterOrValue as T);
      table.setState((old) => {
        const columnSizing = updater(old.columnSizing);
        onChangeColumnSizing?.(columnSizing);
        return {
          ...old,
          columnSizing,
        };
      });
    },

    manualPagination: true,
    pageCount,
    state: { pagination },
  });
  return table;
};
