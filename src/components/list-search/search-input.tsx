import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { ActionList, Box, TextInput } from "@primer/react";
import { ListEndpointDefinition } from "../../list-endpoints/types";
import { ParsedSearchResult, parseSearch } from "../../list-endpoints/search-utils";

export type SearchInputProps = {
  endpoint: ListEndpointDefinition<any>;
  onChange: (result: ParsedSearchResult) => void;
};

export const SearchInput: FC<SearchInputProps> = ({ endpoint, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const parsed = useMemo(() => parseSearch(value, endpoint), [value]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onChange(parsed);
  }, [parsed]);

  return (
    <>
      <Box position="relative">
        <TextInput
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
      Text below
    </>
  );
};
