import { cloneSearch, ParsedSearchResult, reconstructSearchString } from "./search-utils";
import { useStableHandler } from "../../utils";

export const useSearchHelpers = (search: ParsedSearchResult, setSearch: (value: string) => void) => {
  const setFilter = useStableHandler((key: string, value: string, negated = false) => {
    const newSearch = cloneSearch(search);
    newSearch.filters = newSearch.filters.filter((filter) => filter.key !== key);
    newSearch.filters.push({ key, value, negated });
    setSearch(reconstructSearchString(newSearch));
  });
  return { setFilter };
};
