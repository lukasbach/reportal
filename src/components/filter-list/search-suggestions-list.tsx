import React, { memo } from "react";
import { ActionList, Box } from "@primer/react";
import { CloudIcon, CloudOfflineIcon } from "@primer/octicons-react";
import { Suggestion } from "../../common/filter-lists/search-utils";

export type SearchSuggestionsListProps = {
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
  focusedIndex: number;
  setHoveredIndex: (index: number | undefined) => void;
};

export const SearchSuggestionsList = memo<SearchSuggestionsListProps>(
  ({ setHoveredIndex, suggestions, focusedIndex, onSelect }) => {
    return (
      <Box
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border.default"
        borderRadius={2}
        bg="canvas.overlay"
        flexGrow={1}
        overflow="auto"
        onMouseLeave={() => setHoveredIndex(undefined)}
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
                onMouseEnter={() => setHoveredIndex(index)}
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
  }
);
