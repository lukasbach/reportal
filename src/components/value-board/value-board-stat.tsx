import React, { FC } from "react";
import { Box } from "@primer/react";

export type ValueBoardStatProps = {
  label: string;
  value: string | number | null | undefined;
};

export const ValueBoardStat: FC<ValueBoardStatProps> = ({ value, label }) => {
  return (
    <Box sx={{ textAlign: "right", mx: 4 }}>
      <Box
        sx={{
          fontSize: 5,
          fontWeight: "bold",
          // fontFamily: "mono",
          lineHeight: "condensed",
        }}
      >
        {value}
      </Box>
      <Box sx={{ fontSize: 1, color: "fg.subtle", lineHeight: "condensed" }}>{label}</Box>
    </Box>
  );
};
