import React, { FC, useState } from "react";
import { Box, Button } from "@primer/react";
import { SearchInput } from "./search-input";
import { ParsedSearchResult } from "../../list-endpoints/search-utils";
import { ListEndpointDefinition } from "../../list-endpoints/types";
import { FieldSelector } from "./field-selector";
import { ListTable } from "./list-table";
import { useFetchListItems } from "../../list-endpoints/use-fetch-list-items";

export type ListPageProps = {
  endpoint: ListEndpointDefinition<any>;
};

export const ListPage: FC<ListPageProps> = ({ endpoint }) => {
  const [search, setSearch] = useState<ParsedSearchResult>();
  const [fields, setFields] = useState<string[]>(endpoint.defaultFields);
  const { list } = useFetchListItems(endpoint, search ?? null);
  return (
    <Box m={2}>
      <SearchInput endpoint={endpoint} onChange={setSearch} value={search} />
      <FieldSelector endpoint={endpoint} fields={fields} setFields={setFields} />
      <ListTable endpoint={endpoint} fields={fields} data={list} onChangeFields={setFields} />
    </Box>
  );
};
