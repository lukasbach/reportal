import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { ActionList, Box, IconButton, Spinner, TextInput, Token } from "@primer/react";
import { PencilIcon, SearchIcon } from "@primer/octicons-react";
import { ListEndpointDefinition } from "../../list-endpoints/types";
import { ParsedSearchResult, parseSearch } from "../../list-endpoints/search-utils";

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

  return (
    <Box position="relative">
      <Box display="flex" alignItems="center">
        <TextInput
          sx={{ flexGrow: 1 }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
        {isLoading ? (
          <Spinner size="small" sx={{ ml: 2 }} />
        ) : (
          parsed.search !== previousValue?.search && (
            <Box ml={2}>
              <PencilIcon size={16} />
            </Box>
          )
        )}
      </Box>
      <Box
        ref={overlayRef}
        sx={{ visibility: isFocused && parsed.suggestions.length > 0 ? "visible" : "hidden" }}
        mt={1}
        position="absolute"
        zIndex={100}
        width="100%"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border.default"
        borderRadius={2}
        bg="canvas.overlay"
        maxHeight="300px"
        overflow="auto"
      >
        <ActionList role="listbox">
          <ActionList.Group>
            {parsed.suggestions.map((suggestion) => (
              <ActionList.Item
                role="option"
                key={suggestion.newValue}
                onSelect={() => {
                  inputRef.current?.focus();
                  setValue(suggestion.newValue);
                }}
              >
                {suggestion.text}
              </ActionList.Item>
            ))}
          </ActionList.Group>
        </ActionList>
      </Box>
    </Box>
  );
};
