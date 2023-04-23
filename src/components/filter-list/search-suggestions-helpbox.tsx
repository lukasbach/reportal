import React, { FC } from "react";
import { Box, Text } from "@primer/react";
import { Suggestion } from "../../common/filter-lists/search-utils";

export type SearchSuggestionsHelpboxProps = {
  suggestion: Suggestion;
};

export const SearchSuggestionsHelpbox: FC<SearchSuggestionsHelpboxProps> = ({ suggestion }) => {
  return (
    <Box
      borderWidth="1px"
      borderStyle="solid"
      borderColor="border.default"
      borderRadius={2}
      bg="canvas.overlay"
      width="200px"
      overflow="auto"
      ml={4}
    >
      <Text>{suggestion.text}</Text>
    </Box>
  );
};
