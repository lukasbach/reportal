import React, { FC } from "react";
import { Box, Button, Dialog, Text } from "@primer/react";
import { WidgetPayload } from "../../widgets/types";
import { getWidgetDefinition } from "../../widgets/widget-definitions";

export type WidgetConfigDialogProps = {
  widget: WidgetPayload;
  onChange: (widget: WidgetPayload) => void;
  onClose: () => void;
};

export const WidgetConfigDialog: FC<WidgetConfigDialogProps> = ({ widget, onClose, onChange }) => {
  const widgetDefinition = getWidgetDefinition(widget.type);
  return (
    <Dialog isOpen onDismiss={onClose} sx={{ width: "750px", overflow: "auto" }}>
      <Dialog.Header id="header-id">Editing Widget</Dialog.Header>
      <Box p={3}>{widgetDefinition.configComponent({ config: widget.config, onChange })}</Box>
      <Box p={3} display="flex" justifyContent="flex-end">
        <Button sx={{ mr: 2 }}>Cancel</Button>
        <Button variant="primary">Save</Button>
      </Box>
    </Dialog>
  );
};
