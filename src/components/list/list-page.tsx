import React, { FC, useState } from "react";
import { Box } from "@primer/react";
import { SearchInput } from "./search-input";
import { IssueSearchEndpoint } from "../../list-endpoints/issue-search-endpoint";
import { ParsedSearchResult } from "../../list-endpoints/search-utils";

export type ListPageProps = {};

export const ListPage: FC<ListPageProps> = () => {
  const [search, setSearch] = useState<ParsedSearchResult>(null);
  return (
    <Box m={2}>
      <SearchInput endpoint={new IssueSearchEndpoint()} onChange={setSearch} value={search} />
    </Box>
  );
};
