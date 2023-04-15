import React, { FC, useState } from "react";
import { Box, Button, Dialog, Text } from "@primer/react";
import { WidgetPayload } from "../../widgets/types";
import { getWidgetDefinition } from "../../widgets/widget-definitions";
import { useStableHandler } from "../../utils";

export type WidgetConfigDialogProps = {
  widget: WidgetPayload;
  onChange: (widget: WidgetPayload) => void;
  onClose: () => void;
  onDelete: () => void;
};

export const WidgetConfigDialog: FC<WidgetConfigDialogProps> = ({ widget, onClose, onChange, onDelete }) => {
  const [config, setConfig] = useState(widget.config);

  const partialOnChange = useStableHandler((updated: any) => {
    setConfig((old) => ({ ...old, ...updated }));
  });

  const widgetDefinition = getWidgetDefinition(widget.type);
  return (
    <Dialog isOpen onDismiss={onClose} sx={{ width: "750px", overflow: "auto" }}>
      <Dialog.Header id="header-id">Editing Widget</Dialog.Header>
      <Box p={3}>{widgetDefinition.configComponent({ config, onChange: partialOnChange })}</Box>
      <Box p={3} display="flex">
        <Button
          sx={{ mr: 2 }}
          variant="danger"
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          Delete Widget
        </Button>
        <Box flexGrow={1} />
        <Button sx={{ mr: 2 }} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onChange(config);
            onClose();
          }}
        >
          Save
        </Button>
      </Box>
    </Dialog>
  );
};
