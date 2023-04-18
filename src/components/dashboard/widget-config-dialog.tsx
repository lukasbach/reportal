import React, { FC, useState } from "react";
import { Box, Button, Dialog, Text, FormControl, TextInput } from "@primer/react";
import { WidgetPayload } from "../../common/widgets/types";
import { getWidgetDefinition } from "../../widgets/widget-definitions";
import { useStableHandler } from "../../utils";
import { widgetColors } from "./widget-colors";

export type WidgetConfigDialogProps = {
  widget: WidgetPayload;
  onChange: (widget: WidgetPayload, name: string, color: string) => void;
  onClose: () => void;
  onDelete: () => void;
};

export const WidgetConfigDialog: FC<WidgetConfigDialogProps> = ({ widget, onClose, onChange, onDelete }) => {
  const [name, setName] = useState(widget.name);
  const [color, setColor] = useState(widget.color ?? "default");
  const [config, setConfig] = useState(widget.config);

  const partialOnChange = useStableHandler((updated: any) => {
    setConfig((old) => ({ ...old, ...updated }));
  });

  const widgetDefinition = getWidgetDefinition(widget.type);
  return (
    <Dialog isOpen onDismiss={onClose} sx={{ width: "750px", overflow: "auto" }}>
      <Dialog.Header id="header-id">Editing Widget</Dialog.Header>
      <Box sx={{ p: 3, pb: 0, display: "flex", alignItems: "flex-end" }}>
        <FormControl sx={{flexGrow: 1}}>
          <FormControl.Label>Widget Name</FormControl.Label>
          <TextInput
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            sx={{ width: "100%" }}
          />
        </FormControl>
        <Box ml={2}>
          {Object.entries(widgetColors).map(([key, { emph }]) => (
            <Box
              key={key}
              as="button"
              sx={{
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: key === color ? emph : "canvas.default",
                bg: emph,
                borderRadius: "999px",
                width: "16px",
                height: "16px",
                mb: 2,
                ml: "2px",
                cursor: "pointer",
              }}
              onClick={() => setColor(key)}
            />
          ))}
        </Box>
      </Box>
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
            onChange(config, name, color);
            onClose();
          }}
        >
          Save
        </Button>
      </Box>
    </Dialog>
  );
};
