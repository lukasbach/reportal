import React, { useMemo } from "react";
import { createColumnHelper, getCoreRowModel, PaginationState, useReactTable } from "@tanstack/react-table";
import { ListEndpointDefinition } from "../../list-endpoints/types";
import { resolveRecursiveSubitem } from "../../utils";
import { useListContext } from "./list-context";

export const useListTable = (pagination: PaginationState, pageCount: number) => {
  const { data, endpoint, fields } = useListContext();
  const columnConfig = useMemo(() => {
    const columnHelper = createColumnHelper();
    return fields.map((field) => {
      const fieldDef = endpoint.responseFields.find((responseField) => responseField.jsonKey === field);
      return columnHelper.accessor((row) => resolveRecursiveSubitem(row, field), {
        id: field,
        cell: (info) => info.getValue(),
        header: () => <span>{fieldDef?.name}</span>,
      });
    });
  }, [endpoint.responseFields, fields]);

  const slicedData = useMemo(
    () => data.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    [data, pagination.pageIndex, pagination.pageSize]
  );

  return useReactTable({
    data: slicedData,
    columns: columnConfig,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",

    manualPagination: true,
    pageCount,
    state: { pagination },
  });
};
