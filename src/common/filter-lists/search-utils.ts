/* eslint-disable no-continue */
import { FilterValue, ListField, UnclassifiedFilter } from "./types";
import { isNotNullish, resolveRecursiveSubitem } from "../../utils";
import { ListEndpointDefinition } from "./list-endpoint-definition";

export const parseIntoFilters = (search: string) => {
  const filters: UnclassifiedFilter[] = [];
  const searchTerms: string[] = [];
  let acc = "";
  let isInQuote = false;
  let lastAcc = "";

  for (let i = 0; i < search.length; i++) {
    const char = search[i];
    const isFinalChar = i === search.length - 1;

    if (isFinalChar) {
      acc += char;
    }

    if ((char === " " && !isInQuote) || isFinalChar) {
      if (acc.includes(":")) {
        const [key, value] = acc.split(":", 2);
        if (key.startsWith("-")) {
          filters.push({ key: key.slice(1), value, negated: true });
        } else {
          filters.push({ key, value, negated: false });
        }
      } else {
        searchTerms.push(acc);
      }
      lastAcc = acc;
      acc = "";
      continue;
    }

    if (char === '"' && search[i - 1] !== "\\") {
      isInQuote = !isInQuote;
      continue;
    }

    acc += char;
  }

  return { filters, searchTerms, finalItem: search[search.length - 1] === " " ? "" : lastAcc };
};

const testSuggestion = (suggestion: string, matchPart: string) => {
  if (matchPart === " " || matchPart === "") {
    return true;
  }
  return (
    suggestion.toLowerCase() !== matchPart.toLowerCase() && suggestion.toLowerCase().startsWith(matchPart.toLowerCase())
  );
};

export const getSuggestions = (finalPart: string, search: string, endpoint: ListEndpointDefinition<any>) => {
  const searchPrefix = search.slice(0, search.length - finalPart.length);

  if (finalPart.includes(":")) {
    const [filterKey, filterValuePrefix] = finalPart.split(":", 2);
    const filter =
      endpoint.serverFilters.find((serverFilter) => serverFilter.key === filterKey) ??
      endpoint.responseFields.find((clientField) => clientField.key === filterKey);
    const isClientFilter = !!(filter as ListField)?.key;

    if (filter?.suggestions) {
      return filter.suggestions
        .filter((suggestion) => testSuggestion(suggestion, filterValuePrefix))
        .map((suggestion) => ({
          text: `${filterKey}:${suggestion}`,
          newValue: `${searchPrefix}${filterKey}:${suggestion} `,
          isClientFilter,
          description: undefined,
          filter,
        }));
    }
  }

  const serverFilterSuggestions = endpoint.serverFilters
    .filter(({ key }) => testSuggestion(`${key}:`, finalPart))
    .map((filter) => ({
      text: `${filter.key}:`,
      newValue: `${searchPrefix}${filter.key}:`,
      isClientFilter: false,
      description: filter.name,
      filter,
    }));
  const clientFilterSuggestions = endpoint.responseFields
    .filter(({ key }) => testSuggestion(`${key}:`, finalPart))
    .filter(({ key }) => !endpoint.serverFilters.some((serverFilter) => serverFilter.key === key))
    .map((filter) => ({
      text: `${filter.key}:`,
      newValue: `${searchPrefix}${filter.key}:`,
      isClientFilter: true,
      description: filter.name,
      filter,
    }));
  const all = [...serverFilterSuggestions, ...clientFilterSuggestions];
  return all.filter((item, index) => all.findIndex((item2) => item2.text === item.text) === index);
};

export type Suggestion = ReturnType<typeof getSuggestions>[number];

export const parseSearch = (search: string, endpoint: ListEndpointDefinition<any>) => {
  const { filters, searchTerms, finalItem } = parseIntoFilters(search);
  const serverFilters = filters
    .map<FilterValue<ListField> | null>((item) => {
      const filter = endpoint.serverFilters.find((serverFilter) => serverFilter.key === item.key);
      return filter
        ? {
            filter,
            negated: item.negated,
            value: item.value.trim(),
          }
        : null;
    })
    .filter(isNotNullish);
  const clientFilters = filters
    .map<FilterValue<ListField> | null>((item) => {
      if (serverFilters.some((serverFilter) => serverFilter.filter.key === item.key)) {
        return null;
      }

      const filter = endpoint.responseFields.find((clientField) => clientField.key === item.key);
      return filter
        ? {
            filter,
            negated: item.negated,
            value: item.value.trim(),
          }
        : null;
    })
    .filter(isNotNullish);
  return { filters, searchTerms, finalItem, serverFilters, clientFilters, search };
};

export type ParsedSearchResult = ReturnType<typeof parseSearch>;

export const cloneSearch = (search: ParsedSearchResult): ParsedSearchResult => JSON.parse(JSON.stringify(search));

export const reconstructSearchString = (parsedSearch: ParsedSearchResult) => {
  return [
    ...parsedSearch.filters.map(({ key, value, negated }) => `${negated ? "-" : ""}${key}:${value}`),
    ...parsedSearch.searchTerms.map((term) => (term.includes(" ") ? `"${term}"` : term)),
  ].join(" ");
};

export const constructGithubSearch = (searchStrings: string[], filters: FilterValue<ListField>[]) => {
  return [
    ...filters.map(({ filter, value, negated }) => `${negated ? "-" : ""}${filter.key}:${value}`),
    ...searchStrings.map((term) => (term.includes(" ") ? `"${term}"` : term)),
  ].join(" ");
};

export const filterByClientFilters = <T>(item: T, search: ParsedSearchResult | null) => {
  if (!search) {
    return true;
  }
  return search.clientFilters.every(({ filter, value, negated }) => {
    const itemValue = resolveRecursiveSubitem(item, filter.key);
    if (itemValue === undefined) {
      return true;
    }
    return negated
      ? String(itemValue).toLowerCase() !== String(value).toLowerCase()
      : String(itemValue).toLowerCase() === String(value).toLowerCase();
  });
};
