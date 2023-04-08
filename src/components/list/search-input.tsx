import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { ActionList, Box, IconButton, TextInput } from "@primer/react";
import { GoSearch } from "react-icons/all";
import { ListEndpointDefinition } from "../../list-endpoints/types";
import { ParsedSearchResult, parseSearch } from "../../list-endpoints/search-utils";

export type SearchInputProps = {
  endpoint: ListEndpointDefinition<any>;
  value?: ParsedSearchResult;
  onChange: (result: ParsedSearchResult) => void;
};

export const SearchInput: FC<SearchInputProps> = ({ endpoint, onChange, value: previousValue }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const parsed = useMemo(() => parseSearch(value, endpoint), [value]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  return (
    <Box position="relative">
      <Box display="flex">
        <TextInput
          sx={{ flexGrow: 1 }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          ref={inputRef}
          width="100%"
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (overlayRef.current?.contains(e.relatedTarget as any)) {
              return;
            }
            setIsFocused(false);
          }}
        />
        {parsed.search !== previousValue?.search && (
          <IconButton
            aria-label="Search"
            icon={GoSearch}
            onClick={() => {
              onChange(parsed);
            }}
            sx={{ ml: 2 }}
          />
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
