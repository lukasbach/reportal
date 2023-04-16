import { useMeasure } from "@react-hookz/web";
import { useMemo } from "react";

export const useCalcPageSize = <T extends Element>(itemHeight: number) => {
  const [measures, ref] = useMeasure<T>();

  const pageSize = useMemo(() => {
    // TODO FIX: dont use the tbody, but the div above the table element. Make sure that only the table is mounted in that. Subtract a fixed table header height.
    return Math.floor((measures?.height ?? itemHeight) / itemHeight) - 1;
  }, [itemHeight, measures?.height]);

  return [ref, pageSize] as const;
};
