import React, { FC, useState } from "react";
import { Box, Button } from "@primer/react";
import { SearchInput } from "./search-input";
import { ParsedSearchResult } from "../../list-endpoints/search-utils";
import { ListEndpointDefinition } from "../../list-endpoints/types";
import { FieldSelector } from "./field-selector";
import { ListTable } from "./list-table";
import { useFetchListItems } from "../../list-endpoints/use-fetch-list-items";
import { ListProvider } from "./list-context";

export type ListPageProps = {
  endpoint: ListEndpointDefinition<any>;
};

export const ListPage: FC<ListPageProps> = ({ endpoint }) => {
  const [search, setSearch] = useState<ParsedSearchResult>();
  const [fields, setFields] = useState<string[]>(endpoint.defaultFields);
  const { list, loadedCount, totalCount, fetchUntil } = useFetchListItems(endpoint, search ?? null, 10);
  return (
    <ListProvider onChangeFields={setFields} data={list} fields={fields} endpoint={endpoint}>
      <Box display="flex" flexDirection="column" overflow="auto" height="100%">
        <Box p={2}>
          <SearchInput endpoint={endpoint} onChange={setSearch} value={search} />
          <FieldSelector endpoint={endpoint} fields={fields} setFields={setFields} />
        </Box>
        <ListTable />
        <Box p={2}>
          {loadedCount}/{totalCount}
          <button onClick={() => fetchUntil(loadedCount + 10)}>Fetch next</button>
        </Box>
      </Box>
    </ListProvider>
  );
};
