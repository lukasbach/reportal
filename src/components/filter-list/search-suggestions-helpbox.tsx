import React, { FC, PropsWithChildren, ReactNode } from "react";
import { Box, StyledOcticon, Text } from "@primer/react";
import {
  CalendarIcon,
  CheckCircleIcon,
  CloudIcon,
  CloudOfflineIcon,
  EyeClosedIcon,
  ListUnorderedIcon,
} from "@primer/octicons-react";
import { Suggestion } from "../../common/filter-lists/search-utils";
import { FieldType, ListField } from "../../common/filter-lists/types";

export type SearchSuggestionsHelpboxProps = {
  suggestion?: Suggestion;
};

const Section: FC<{ if: boolean; icon: React.ElementType; heading: string; children: ReactNode }> = ({
  if: condition,
  icon,
  heading,
  children,
}) =>
  condition ? (
    <>
      <Text as="p" fontSize={2} fontWeight="bold" mt={3}>
        <StyledOcticon icon={icon} size={16} sx={{ mr: 2 }} />
        {heading}
      </Text>
      <Text as="p" fontSize={1}>
        {children}
      </Text>
    </>
  ) : null;

const Code: FC<PropsWithChildren> = ({ children }) => (
  <Box as="code" bg="canvas.inset" p={1} borderRadius="4px">
    {children}
  </Box>
);

export const SearchSuggestionsHelpbox: FC<SearchSuggestionsHelpboxProps> = ({ suggestion }) => {
  if (!suggestion) return null;

  const filterKey = (suggestion.filter as ListField).key ?? (suggestion.filter as ListField).key;
  return (
    <Box
      borderWidth="1px"
      borderStyle="solid"
      borderColor="border.default"
      borderRadius={2}
      bg="canvas.overlay"
      width="300px"
      overflow="auto"
      p={2}
      px={3}
      ml={4}
    >
      <Text as="p" fontSize={3} fontWeight="bold">
        {suggestion.description}
      </Text>

      <Section if={suggestion.filter.type === FieldType.Boolean} icon={CheckCircleIcon} heading="Boolean type">
        Supports values <Code>true</Code> and <Code>false</Code>.
      </Section>

      <Section if={suggestion.filter.type === FieldType.Number} icon={CheckCircleIcon} heading="Boolean type">
        Supports numbers. You can use limits, like <Code>{">"}100</Code> or <Code>{"<="}100</Code>. You can also use
        ranges, like <Code>5..10</Code>.
      </Section>

      <Section if={suggestion.filter.type === FieldType.Date} icon={CalendarIcon} heading="Date type">
        Supports date strings. Use exact dates like <Code>2021-01-01</Code>, or limits like <Code>{">"}2021-01-01</Code>{" "}
        or <Code>{"<="}2021-01-01</Code>.
      </Section>

      <Section
        if={suggestion.filter.type === FieldType.Enum && !!suggestion.filter.suggestions}
        icon={ListUnorderedIcon}
        heading="Enumeration type"
      >
        Supports values{" "}
        {suggestion.filter.suggestions?.map((v, i, a) => (
          <>
            <Code>{v}</Code>
            {i !== a.length - 1 && ", "}
          </>
        ))}
        .
      </Section>

      <Section if={suggestion.isClientFilter} icon={CloudOfflineIcon} heading="Client Filter">
        The filter is evaluated client-side, and only hides non-matching data only after it is loaded. Highly
        constrictive filters can slow the app.
      </Section>
      <Section if={!suggestion.isClientFilter} icon={CloudIcon} heading="GitHub Filter">
        Filter supported by GitHub&apos;s search backend, which will be evaluated on the server-side.
      </Section>

      <Section if icon={EyeClosedIcon} heading="Check Inversion">
        You can invert the filter by prefixing it with <Code>-</Code>, like <Code>-{filterKey}:value</Code>.
      </Section>
    </Box>
  );
};
