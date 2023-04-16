import React, { FC } from "react";
import { ActionList, ActionMenu, Box, FormControl, IconButton, TextInput } from "@primer/react";
import { GrabberIcon, TrashIcon } from "@primer/octicons-react";
import { useDrag, useDrop } from "react-dnd";
import { Column, RowData } from "@tanstack/react-table";
import { ValueBoardItem } from "../../widgets/value-board-widget";
import { FilterListSelector } from "../common/filter-list-selector";
import { RepoInput } from "../common/repo-input";
import { valueBoardPresets, valueBoardPresetsList } from "../../common/widgets/value-board-item-presets";

export type ValueBoardConfigItemProps<T extends string = ValueBoardItem["type"]> = {
  config: ValueBoardItem & { type: T };
  onChange: (newConfig: ValueBoardItem & { type: T }) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  onDelete: () => void;
  onSwap: (from: ValueBoardItem, to: ValueBoardItem) => void;
};

const UnsetItemConfig: FC<ValueBoardConfigItemProps<"unset">> = ({ config, onChange }) => {
  return (
    <ActionMenu>
      <ActionMenu.Button sx={{ mt: 2 }} variant="primary">
        Choose an item type
      </ActionMenu.Button>

      <ActionMenu.Overlay sx={{ width: "300px" }}>
        <ActionList>
          {valueBoardPresetsList.map(({ presetKey, name, initial }) => (
            <ActionList.Item key={presetKey} onClick={() => onChange({ ...initial } as any)}>
              {name}
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

const ItemWithRepoConfig: FC<ValueBoardConfigItemProps<"repoStat">> = ({ config, onChange }) => {
  return (
    <Box mt={3}>
      <FormControl>
        <FormControl.Label>Repo Name</FormControl.Label>
        <RepoInput value={config.repo} onChange={(repo) => onChange({ ...config, repo })} />
      </FormControl>
    </Box>
  );
};

export const ValueBoardConfigItem: FC<ValueBoardConfigItemProps> = (props) => {
  const { config, onChange, onDelete, onSwap } = props;

  const [{ isOver }, dropRef] = useDrop({
    collect: (monitor) => ({ isOver: monitor.isOver() }),
    accept: "valueboarditem",
    hover: (item: ValueBoardItem) => {
      onSwap(item, config);
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/naming-convention
  const [_, dragRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => config,
    type: "valueboarditem",
  });

  return (
    <Box
      ref={dropRef}
      sx={{
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "border.default",
        boxShadow: "shadow.small",
        bg: isOver ? "accent.subtle" : "canvas.subtle",
        p: 2,
        mb: 4,
        pl: 5,
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Box sx={{ ml: -4, mr: 2, cursor: "grab" }} ref={dragRef}>
          <GrabberIcon size={16} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", pr: 2, fontWeight: "bold", fontSize: 1 }}>
          {valueBoardPresets[config.preset]?.name ?? "Undefined Counter"}:
        </Box>
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
      {config.type === "repoStat" && <ItemWithRepoConfig {...(props as any)} />}
    </Box>
  );
};
