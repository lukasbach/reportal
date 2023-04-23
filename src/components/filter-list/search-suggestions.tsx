import React, { FC, MutableRefObject, useEffect, useState } from "react";
import { Box } from "@primer/react";
import { Suggestion } from "../../common/filter-lists/search-utils";
import { SearchSuggestionsList } from "./search-suggestions-list";
import { SearchSuggestionsHelpbox } from "./search-suggestions-helpbox";

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
  const [hoveredIndex, setHoveredIndex] = useState<number>();

  useEffect(() => {
    setHoveredIndex(focusedIndex);
  }, [focusedIndex]);

  return (
    <Box
      ref={overlayRef}
      sx={{ visibility: isFocused && suggestions.length > 0 ? "visible" : "hidden" }}
      mt={1}
      position="absolute"
      zIndex={100}
      width="100%"
      maxHeight="400px"
      display="flex"
    >
      <SearchSuggestionsList
        suggestions={suggestions}
        onSelect={onSelect}
        focusedIndex={focusedIndex}
        setHoveredIndex={setHoveredIndex}
      />

      <SearchSuggestionsHelpbox suggestion={suggestions[hoveredIndex ?? focusedIndex]} />
    </Box>
  );
};
