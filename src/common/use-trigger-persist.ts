import { useEffect, useRef } from "react";
import { useDebouncedCallback, usePrevious } from "@react-hookz/web";
import { useRefCopy, useStableHandler } from "../utils";

const s = 1000;

export const useTriggerPersist = <T>(id: string, persist: (id: string, state: T) => void, currentData: T) => {
  const dirty = useRef(false);

  const previousId = usePrevious(id);
  const previousIdRef = useRefCopy(previousId);
  const previousData = usePrevious(currentData);
  const previousDataRef = useRefCopy(previousData);

  const save = useStableHandler(() => {
    if (!dirty.current) {
      return;
    }

    persist(id, currentData);
    dirty.current = false;
  });

  const delayedSave = useDebouncedCallback(save, [save], s * 15, s * 60 * 2);

  useEffect(
    () => () => {
      // TODO also todo: selection of columns in filter lists doesnt persist
      if (!dirty.current) {
        return;
      }
      if (!previousIdRef.current || !previousDataRef.current) {
        return;
      }
      persist(previousIdRef.current, previousDataRef.current);
      dirty.current = false;
    },
    [persist, previousDataRef, previousIdRef]
  );

  return useStableHandler(() => {
    dirty.current = true;
    delayedSave();
  });
};
