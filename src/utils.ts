import { useCallback, useRef } from "react";

export const isNotNullish = <T>(value: T | null | undefined): value is T => value !== undefined && value !== null;

export const resolveRecursiveSubitem = (structure: any, key: string) => {
  const parts = key.split(".");
  let current = structure;
  for (const part of parts) {
    current = current[part];
  }
  return current;
};

export const useRefCopy = <T>(value: T) => {
  const ref = useRef<T>(value);
  ref.current = value;
  return ref;
};

export const useStableHandler = <T extends (...args: any[]) => any>(handler: T) => {
  const handlerRef = useRefCopy<T>(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback<T>(((...args) => handlerRef.current(...args)) as T, [handlerRef]);
};
