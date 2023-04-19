import React, { useRef, useState } from "react";
import { useStableHandler } from "../../utils";
import { useImport } from "./use-import";
import { useConfirm, usePrompt } from "../../dialogs";

export const useImportFlow = () => {
  const importData = useImport();
  const [isImporting, setIsImporting] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const { confirm: openMissingFilesError, dialog: missingFilesError } = useConfirm(
    "Import failed",
    "You need to select one file.",
    "Okay",
    "Cancel",
    true
  );

  const { confirm: openCantLoadFileError, dialog: cantLoadFileError } = useConfirm(
    "Import failed",
    "Loading the data failed.",
    "Okay",
    "Cancel",
    true
  );

  const handleImport = useStableHandler(async () => {
    setIsImporting(true);

    if (!fileInput.current?.files || fileInput.current.files.length !== 1) {
      await openMissingFilesError();
      setIsImporting(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          console.log(e.target?.result as string);
          await importData(e.target?.result as string);
          setIsImporting(false);
        } catch (e) {
          console.error(e);
          openCantLoadFileError();
          setIsImporting(false);
        }
      };
      reader.readAsText(fileInput.current.files[0]);
    } catch (e) {
      console.error(e);
      openCantLoadFileError();
      setIsImporting(false);
    }
  });

  const importDialogs = (
    <>
      {missingFilesError}
      {cantLoadFileError}
    </>
  );

  return { handleImport, fileInput, importDialogs, isImporting };
};
