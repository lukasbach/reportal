import { useEffect, useMemo, useState } from "react";
import { useKeyboardEvent } from "@react-hookz/web";
import { getSuggestions, ParsedSearchResult } from "../../common/filter-lists/search-utils";
import { ListEndpointDefinition } from "../../common/filter-lists/list-endpoint-definition";
import { useRefCopy, useStableHandler } from "../../utils";

export const useSuggestions = (
  search: ParsedSearchResult,
  focused: boolean,
  endpoint: ListEndpointDefinition,
  onSubmit: () => void,
  onClose: () => void
) => {
  const suggestions = useMemo(
    () => getSuggestions(search.finalItem, search.search, endpoint),
    [endpoint, search.finalItem, search.search]
  );
  const isFocusedRef = useRefCopy(focused);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const changeActiveSuggestion = useStableHandler((index: number) => {
    const boundedIndex = Math.max(0, Math.min(suggestions.length - 1, index));
    setSuggestionIndex(boundedIndex);
    document.getElementsByClassName("suggestion-item").item(boundedIndex)?.scrollIntoView({ block: "nearest" });
  });

  useEffect(() => {
    setSuggestionIndex(0);
  }, [search, focused]);

  useKeyboardEvent("ArrowDown", () => {
    if (isFocusedRef.current) {
      changeActiveSuggestion(suggestionIndex + 1);
    }
  });

  useKeyboardEvent("ArrowUp", () => {
    if (isFocusedRef.current) {
      changeActiveSuggestion(suggestionIndex - 1);
    }
  });

  useKeyboardEvent("Enter", (e) => {
    if (e.ctrlKey || (isFocusedRef.current && suggestions.length === 0)) {
      onSubmit();
      return;
    }

    if (isFocusedRef.current && suggestions.length > 0) {
      (document.getElementsByClassName("suggestion-item").item(suggestionIndex) as HTMLDivElement)?.click();
    }
  });

  useKeyboardEvent("Tab", (e) => {
    if (isFocusedRef.current && suggestions.length > 0) {
      e.preventDefault();
      (document.getElementsByClassName("suggestion-item").item(suggestionIndex) as HTMLDivElement)?.click();
    }
  });

  useKeyboardEvent("Escape", () => {
    if (isFocusedRef.current) {
      onClose();
    }
  });

  return { suggestions, suggestionIndex };
};
