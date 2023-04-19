import React, { useState } from "react";
import { useStableHandler } from "../../utils";
import { useConfirm } from "../../dialogs";
import { useClearData } from "./use-clear-data";
import { useDeleteAccount } from "../../auth/hooks";

export const useDeleteUserFlow = () => {
  const clearData = useClearData();
  const { deleteAccount } = useDeleteAccount();
  const [isDeleting, setIsDeleting] = useState(false);

  const { confirm: open1, dialog: dialog1 } = useConfirm(
    "Are you sure?",
    "Are you sure you want to clear all your data and delete your account? This cannot be undone.",
    "Okay",
    "Cancel",
    true
  );

  const { confirm: open2, dialog: dialog2 } = useConfirm(
    "Are you really sure?",
    "Your data will be removed and your account will be removed.",
    "Remove all my data and delete my account",
    "Cancel",
    true
  );

  const deleteDialogs = (
    <>
      {dialog1}
      {dialog2}
    </>
  );

  const deleteUserFlow = useStableHandler(async () => {
    await open1();
    await open2();
    setIsDeleting(true);
    await clearData();
    await deleteAccount();
    setIsDeleting(false);
  });

  return { deleteUserFlow, deleteDialogs, isDeleting };
};
