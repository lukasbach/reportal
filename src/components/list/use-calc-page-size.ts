import { useMeasure } from "@react-hookz/web";
import { useMemo } from "react";

export const useCalcPageSize = <T extends Element>(itemHeight: number) => {
  const [measures, ref] = useMeasure<T>();

  const pageSize = useMemo(() => {
    // -1 because of header row
    return Math.floor((measures?.height ?? itemHeight) / itemHeight) - 1;
  }, [itemHeight, measures?.height]);

  return [ref, pageSize] as const;
};
