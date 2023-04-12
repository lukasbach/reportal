import React, { useMemo, useRef, useState } from "react";
import { Box, Button, Dialog, FormControl, TextInput } from "@primer/react";
import { useRefCopy, useStableHandler } from "./utils";

export const useDialog = ({
  header,
  body,
  footer,
}: {
  header?: JSX.Element | string;
  body?: JSX.Element | string;
  footer?: JSX.Element | string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const returnRef = useRef<any>(null);
  const dialog = useMemo(
    () => (
      <Dialog returnFocusRef={returnRef} isOpen={isOpen} onDismiss={() => setIsOpen(false)} aria-labelledby="header-id">
        {header && <Dialog.Header id="header-id">{header}</Dialog.Header>}
        {body && <Box p={3}>{body}</Box>}
        {footer && (
          <Box display="flex" mt={-2} p={3} justifyContent="flex-end">
            {footer}
          </Box>
        )}
      </Dialog>
    ),
    [body, footer, header, isOpen]
  );
  const open = useStableHandler(() => setIsOpen(true));
  const close = useStableHandler(() => setIsOpen(false));
  return { dialog, returnRef, setIsOpen, isOpen, open, close };
};

export const useConfirm = (title: string, body: JSX.Element | string, yes = "Yes", no = "No", danger = false) => {
  const noRef = useRef(() => {});
  const yesRef = useRef(() => {});
  const dialog = useDialog({
    header: title,
    body: <form onSubmit={yesRef.current}>{body}</form>,
    footer: (
      <>
        <Button onClick={noRef.current}>{no}</Button>
        <Button variant={danger ? "danger" : undefined} onClick={yesRef.current} sx={{ ml: 2 }}>
          {yes}
        </Button>
      </>
    ),
  });

  const confirm = useStableHandler(() => {
    dialog.setIsOpen(true);
    return new Promise<void>((resolve) => {
      noRef.current = () => {
        dialog.close();
      };
      yesRef.current = () => {
        resolve();
        dialog.close();
      };
    });
  });

  return { confirm, ...dialog };
};

export const usePrompt = (title: string, placeholder: string, yes = "Okay", no = "Cancel", danger = false) => {
  const [value, setValue] = useState("");
  const valueCopy = useRefCopy(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialog = useConfirm(
    title,
    <FormControl>
      <FormControl.Label>Icon action</FormControl.Label>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{ width: "100%" }}
        ref={inputRef}
      />
    </FormControl>,
    yes,
    no,
    danger
  );

  const prompt = useStableHandler(async (initialValue = "") => {
    setValue(initialValue);
    setTimeout(() => inputRef.current?.focus(), 100);
    await dialog.confirm();
    return valueCopy.current;
  });

  const { confirm, ...rest } = dialog;
  return { ...rest, value, prompt };
};
