import React, { FC } from "react";
import { ActionList, ActionMenu, Box, IconButton, TextInput } from "@primer/react";
import { TrashIcon } from "@primer/octicons-react";
import { ValueBoardItem, valueBoardItemTypes } from "../../widgets/value-board-widget";
import { FilterListSelector } from "../common/filter-list-selector";

export type ValueBoardConfigItemProps<T extends string = ValueBoardItem["type"]> = {
  config: ValueBoardItem & { type: T };
  onChange: (newConfig: ValueBoardItem & { type: T }) => void;
  onDelete: () => void;
};

const UnsetItemConfig: FC<ValueBoardConfigItemProps<"unset">> = ({ config, onChange }) => {
  return (
    <ActionMenu>
      <ActionMenu.Button sx={{ mt: 2 }} variant="primary">
        Choose an item type
      </ActionMenu.Button>

      <ActionMenu.Overlay>
        <ActionList>
          {Object.entries(valueBoardItemTypes).map(([type, value]) => (
            <ActionList.Item key={type} onClick={() => onChange({ ...value.initial, name: config.name } as any)}>
              {value.name}
            </ActionList.Item>
          ))}
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  );
};

const FilterListTotalItemConfig: FC<ValueBoardConfigItemProps<"filterListTotal">> = ({ config, onChange }) => {
  return (
    <Box mt={3}>
      <FilterListSelector state={config.filterList} onChange={(state) => onChange({ ...config, filterList: state })} />
    </Box>
  );
};

export const ValueBoardConfigItem: FC<ValueBoardConfigItemProps> = (props) => {
  const { config, onChange, onDelete } = props;
  return (
    <Box
      sx={{
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "border.default",
        boxShadow: "shadow.small",
        bg: "canvas.subtle",
        p: 2,
        mb: 4,
      }}
    >
      <Box sx={{ display: "flex" }}>
        <TextInput
          aria-label="Item name"
          placeholder="Item name"
          value={config.name}
          sx={{ flexGrow: 1, mr: 2 }}
          onChange={(e) => {
            onChange({
              ...config,
              name: e.target.value,
            });
          }}
        />
        <IconButton icon={TrashIcon} aria-label="Delete item" onClick={onDelete} />
      </Box>
      {config.type === "unset" && <UnsetItemConfig {...(props as any)} />}
      {config.type === "filterListTotal" && <FilterListTotalItemConfig {...(props as any)} />}
    </Box>
  );
};
