import React, { FC } from "react";
import { Box, FormControl, SegmentedControl, TextInput } from "@primer/react";

export type NpmConfigInputProps = {
  packageName: string;
  range: string;
  onChangePackageName: (packageName: string) => void;
  onChangeRange: (range: string) => void;
};

// TODO aggregate per week in graph
// TODO hide today in graph input

export const NpmConfigInput: FC<NpmConfigInputProps> = ({ onChangeRange, range, onChangePackageName, packageName }) => {
  return (
    <>
      <FormControl>
        <FormControl.Label>NPM Package Name</FormControl.Label>
        <TextInput
          value={packageName}
          onChange={(e) => {
            onChangePackageName(e.target.value);
          }}
          sx={{ width: "100%" }}
        />
      </FormControl>
      <Box display="flex" width="100%" mt={2}>
        <SegmentedControl aria-label="Download Kind">
          {[
            { label: "Last Day", value: "last-day" },
            { label: "Last Week", value: "last-week" },
            { label: "Last Month", value: "last-month" },
            { label: "Last Year", value: "last-year" },
            { label: "Custom Range", value: "2023-01-01:2023-01-31", custom: true },
          ].map(({ label, value, custom }) => (
            <SegmentedControl.Button
              key={value}
              selected={
                range === value || (custom && !["last-day", "last-week", "last-month", "last-year"].includes(range))
              }
              onClick={() => onChangeRange(value)}
            >
              {label}
            </SegmentedControl.Button>
          ))}
        </SegmentedControl>
        {!["last-day", "last-week", "last-month", "last-year"].includes(range) && (
          <TextInput value={range} onChange={(e) => onChangeRange(e.target.value)} sx={{ flexGrow: 1, ml: 2 }} />
        )}
      </Box>
    </>
  );
};
