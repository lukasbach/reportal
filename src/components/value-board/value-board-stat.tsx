import React, { FC } from "react";
import { Box, RelativeTime } from "@primer/react";

export type ValueBoardStatProps = {
  label: string;
  value: string | number | null | undefined;
};

function isIsoDate(str) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(str);
}

const formatValue = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) {
    return "-";
  }
  if (typeof value === "number") {
    if (value > 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value > 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value > 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
  }
  if (isIsoDate(value)) {
    return <RelativeTime datetime={`${value}`} format="micro" />;
  }
  return value;
};

export const ValueBoardStat: FC<ValueBoardStatProps> = ({ value, label }) => {
  return (
    <Box sx={{ textAlign: "right", ml: 4, width: "90px" }}>
      <Box
        sx={{
          fontSize: 5,
          fontWeight: "bold",
          // fontFamily: "mono",
          lineHeight: "condensed",
        }}
      >
        {formatValue(value)}
      </Box>
      <Box sx={{ fontSize: 1, color: "fg.subtle", lineHeight: "condensed" }}>{label}</Box>
    </Box>
  );
};
