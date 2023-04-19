import React, { useState } from "react";
import { useStableHandler } from "../../utils";
import { useConfirm } from "../../dialogs";
import { useClearData } from "./use-clear-data";

export const useClearDataFlow = () => {
  const clearData = useClearData();
  const [isClearing, setIsClearing] = useState(false);

  const { confirm: open1, dialog: dialog1 } = useConfirm(
    "Are you sure?",
    "Are you sure you want to clear all your data? This cannot be undone.",
    "Okay",
    "Cancel",
    true
  );

  const { confirm: open2, dialog: dialog2 } = useConfirm(
    "Are you really sure?",
    "Your data will be removed.",
    "Remove all my data",
    "Cancel",
    true
  );

  const clearDialogs = (
    <>
      {dialog1}
      {dialog2}
    </>
  );

  const clearDataFlow = useStableHandler(async () => {
    await open1();
    await open2();
    setIsClearing(true);
    await clearData();
    setIsClearing(false);
  });

  return { clearDataFlow, clearDialogs, isClearing };
};
