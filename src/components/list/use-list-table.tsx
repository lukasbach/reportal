import React, { useMemo } from "react";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ListEndpointDefinition } from "../../list-endpoints/types";
import { resolveRecursiveSubitem } from "../../utils";

export const useListTable = (endpoint: ListEndpointDefinition<any>, fields: string[], data: any[]) => {
  const columnConfig = useMemo(() => {
    const columnHelper = createColumnHelper();
    const defaultColumns = fields.map((field) => {
      const fieldDef = endpoint.responseFields.find((responseField) => responseField.jsonKey === field);
      return columnHelper.accessor((row) => resolveRecursiveSubitem(row, field), {
        id: field,
        cell: (info) => info.getValue(),
        header: () => <span>{fieldDef.name}</span>,
      });
    });
    return defaultColumns;
  }, [endpoint.responseFields, fields]);

  return useReactTable({
    data,
    columns: columnConfig,
    getCoreRowModel: getCoreRowModel(),
  });
};
