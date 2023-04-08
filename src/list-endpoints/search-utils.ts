/* eslint-disable no-continue */
import { ListEndpointDefinition, UnclassifiedFilter } from "./types";

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

const getSuggestions = (finalPart: string, search: string, endpoint: ListEndpointDefinition<any>) => {
  const searchPrefix = search.slice(0, search.length - finalPart.length);

  if (finalPart.includes(":")) {
    console.log(2, { finalPart, search, searchPrefix });
    const [filterKey, filterValuePrefix] = finalPart.split(":", 2);
    const filter =
      endpoint.serverFilters.find((serverFilter) => serverFilter.key === filterKey) ??
      endpoint.responseFields.find((clientField) => clientField.name.toLowerCase() === filterKey);

    if (filter?.suggestions) {
      return filter.suggestions
        .filter((suggestion) => testSuggestion(suggestion, filterValuePrefix))
        .map((suggestion) => ({
          text: `${filterKey}:${suggestion}`,
          newValue: `${searchPrefix}${filterKey}:${suggestion} `,
        }));
    }
  }

  const clientFilterSuggestions = endpoint.responseFields
    .filter(({ name }) => testSuggestion(`${name}:`, finalPart))
    .map(({ name }) => ({
      text: `${name}:`,
      newValue: `${searchPrefix}${name}:`,
    }));
  const serverFilterSuggestions = endpoint.serverFilters
    .filter(({ key }) => testSuggestion(`${key}:`, finalPart))
    .map(({ key }) => ({
      text: `${key}:`,
      newValue: `${searchPrefix}${key}:`,
    }));
  console.log({ finalPart, search, searchPrefix, clientFilterSuggestions, serverFilterSuggestions });
  return [...clientFilterSuggestions, ...serverFilterSuggestions];
};

export const parseSearch = (search: string, endpoint: ListEndpointDefinition<any>) => {
  const { filters, searchTerms, finalItem } = parseIntoFilters(search);
  const serverFilters = filters.filter((filter) =>
    endpoint.serverFilters.some((serverFilter) => serverFilter.key === filter.key)
  );
  const clientFilters = filters.filter((filter) =>
    endpoint.responseFields.some((clientField) => clientField.name.toLowerCase() === filter.key)
  );
  const suggestions = getSuggestions(finalItem, search, endpoint);
  return { filters, searchTerms, finalItem, serverFilters, clientFilters, suggestions };
};
