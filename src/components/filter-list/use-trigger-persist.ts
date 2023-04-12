import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "@react-hookz/web";
import { useStableHandler } from "../../utils";

const s = 1000;

export const useTriggerPersist = <T>(getData: () => T, persist: (state: T) => void) => {
  const dirty = useRef(false);

  const save = useStableHandler(() => {
    if (!dirty.current) {
      return;
    }
    persist(getData());
    dirty.current = false;
  });

  useEffect(() => save, [save]);
  return useDebouncedCallback(
    () => {
      dirty.current = true;
      save();
    },
    [save],
    s * 15,
    s * 60 * 2
  );
};
