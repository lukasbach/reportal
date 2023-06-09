import React, { FC } from "react";
import { Box, IconButton, TextInput, Token } from "@primer/react";
import { StarFillIcon, StarIcon } from "@primer/octicons-react";
import { SearchInput } from "./search-input";
import { FieldSelector } from "./field-selector";
import { getEndpoint } from "../../list-endpoints/endpoints";
import { FilterListState } from "./types";
import { ParsedSearchResult } from "../../common/filter-lists/search-utils";
import { EndpointIcon } from "../common/endpoint-icon";

export type FilterListHeaderProps = {
  embedded?: boolean;
  data: FilterListState;
  search: ParsedSearchResult;
  setSearch: (search: ParsedSearchResult) => void;
  name: string;
  setName: (name: string) => void;
  pinned: boolean;
  setPinned: (pinned: boolean) => void;
  fields: string[];
  setFields: (fields: string[]) => void;
  isFetching: boolean;
};

export const FilterListHeader: FC<FilterListHeaderProps> = ({
  data,
  fields,
  setFields,
  pinned,
  setPinned,
  search,
  setSearch,
  isFetching,
  embedded,
  name,
  setName,
}) => {
  const endpoint = getEndpoint(data.endpointId);
  return (
    <>
      {!embedded && (
        <Box display="flex" alignItems="center" mb={2}>
          <Token
            text={endpoint.name}
            size="xlarge"
            sx={{ mr: 2, color: "accent.fg", borderColor: "accent.emphasis", bg: "accent.subtle" }}
            // eslint-disable-next-line react/no-unstable-nested-components
            leadingVisual={() => <EndpointIcon endpointId={endpoint.id} />}
          />
          <TextInput value={name} onChange={(e) => setName(e.target.value)} sx={{ flexGrow: 1 }} />
          <IconButton
            icon={pinned ? StarFillIcon : StarIcon}
            sx={{ ml: 2 }}
            aria-label="Change Pin Status"
            onClick={() => setPinned(!pinned)}
          />
        </Box>
      )}
      <Box display="flex" alignItems="center" mb={2} pr={embedded ? 6 : 0}>
        <SearchInput endpoint={endpoint} onChange={setSearch} value={search} isLoading={isFetching} />
        <Box ml={2}>
          <FieldSelector endpoint={endpoint} fields={fields} setFields={setFields} />
        </Box>
      </Box>
    </>
  );
};
