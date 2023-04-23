import React, { FC, useMemo, useRef, useState } from "react";
import { ActionList, ActionMenu, Box, TextInput } from "@primer/react";
import { CloudIcon, CloudOfflineIcon, PencilIcon, SearchIcon } from "@primer/octicons-react";
import { ParsedSearchResult, parseSearch } from "../../common/filter-lists/search-utils";
import { ListEndpointDefinition } from "../../common/filter-lists/list-endpoint-definition";
import { useSearchHelpers } from "../../common/filter-lists/use-search-helpers";
import { useSuggestions } from "./use-suggestions";
import { SearchSuggestions } from "./search-suggestions";

export type SearchInputProps = {
  endpoint: ListEndpointDefinition;
  value: ParsedSearchResult;
  onChange: (result: ParsedSearchResult) => void;
  isLoading: boolean;
};

export const SearchInput: FC<SearchInputProps> = ({ endpoint, onChange, value: previousValue, isLoading }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(previousValue.search);
  const parsed = useMemo(() => parseSearch(value, endpoint), [endpoint, value]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const { setFilter } = useSearchHelpers(parsed, (v) => {
    setValue(v);
    onChange(parseSearch(v, endpoint));
  });
  const orderBy = endpoint.getSelectedOrderBy?.(parsed);
  const { suggestions, suggestionIndex } = useSuggestions(
    parsed,
    isFocused,
    endpoint,
    () => onChange(parsed),
    () => setIsFocused(false)
  );

  return (
    <Box position="relative" flexGrow={1}>
      <Box display="flex" alignItems="center">
        <TextInput
          sx={{ flexGrow: 1 }}
          contrast
          loading={isLoading}
          leadingVisual={SearchIcon}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setIsFocused(true);
          }}
          ref={inputRef}
          width="100%"
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (overlayRef.current?.contains(e.relatedTarget as any)) {
              inputRef.current?.focus();
              return;
            }
            setIsFocused(false);
            onChange(parsed);
          }}
        />
        {parsed.search !== previousValue?.search && (
          <Box ml={2}>
            <PencilIcon size={16} />
          </Box>
        )}
        {endpoint.orderByOptions && (
          <ActionMenu>
            <ActionMenu.Button sx={{ ml: 2 }}>Sort by {orderBy?.name ?? "..."}</ActionMenu.Button>

            <ActionMenu.Overlay>
              <ActionList>
                {endpoint.orderByOptions.map((option) => (
                  <ActionList.Item
                    key={option.name}
                    onClick={() => setFilter(option.key, option.value)}
                    active={orderBy?.value === option.value}
                  >
                    {option.name}
                  </ActionList.Item>
                ))}
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        )}
      </Box>
      <SearchSuggestions
        suggestions={suggestions}
        overlayRef={overlayRef}
        isFocused={isFocused}
        focusedIndex={suggestionIndex}
        onSelect={({ newValue }) => {
          inputRef.current?.focus();
          setValue(newValue);
        }}
      />
    </Box>
  );
};
