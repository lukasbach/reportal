import React, { FC, MutableRefObject } from "react";
import { ActionList, Box } from "@primer/react";
import { CloudIcon, CloudOfflineIcon } from "@primer/octicons-react";
import { Suggestion } from "../../common/filter-lists/search-utils";

export type SearchSuggestionsProps = {
  isFocused: boolean;
  suggestions: Suggestion[];
  overlayRef: MutableRefObject<HTMLDivElement | null>;
  onSelect: (suggestion: Suggestion) => void;
  focusedIndex: number;
};

export const SearchSuggestions: FC<SearchSuggestionsProps> = ({
  suggestions,
  overlayRef,
  onSelect,
  isFocused,
  focusedIndex,
}) => {
  return (
    <Box
      ref={overlayRef}
      sx={{ visibility: isFocused && suggestions.length > 0 ? "visible" : "hidden" }}
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
          {suggestions.map((suggestion, index) => (
            <ActionList.Item
              role="option"
              key={suggestion.newValue}
              onSelect={() => {
                onSelect(suggestion);
              }}
              active={focusedIndex === index}
              className="suggestion-item"
            >
              <ActionList.LeadingVisual>
                {suggestion.isClientFilter ? <CloudOfflineIcon size={16} /> : <CloudIcon size={16} />}
              </ActionList.LeadingVisual>
              {suggestion.text}
              {suggestion.description && <ActionList.Description>{suggestion.description}</ActionList.Description>}
            </ActionList.Item>
          ))}
        </ActionList.Group>
      </ActionList>
    </Box>
  );
};
