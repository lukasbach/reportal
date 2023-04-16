import React, { FC, ReactNode } from "react";
import { Box, IconButton, TextInput, Token } from "@primer/react";
import { ChevronDownIcon, PinIcon, StarFillIcon, StarIcon } from "@primer/octicons-react";
import { FilterListTypeSelector } from "./filter-list-type-selector";
import { SearchInput } from "./search-input";
import { FieldSelector } from "./field-selector";
import { getEndpoint } from "../../list-endpoints/endpoints";
import { FilterListState } from "./types";
import { ParsedSearchResult } from "../../list-endpoints/search-utils";
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
      <Box display="flex" alignItems="center" mb={2}>
        <Token
          text={endpoint.name}
          size="xlarge"
          sx={{ mr: 2 }}
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
      <Box display="flex" alignItems="center" mb={2}>
        <SearchInput endpoint={endpoint} onChange={setSearch} value={search} isLoading={isFetching} />
        <Box ml={2}>
          <FieldSelector endpoint={endpoint} fields={fields} setFields={setFields} />
        </Box>
      </Box>
    </>
  );
};
