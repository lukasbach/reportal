import React from "react";
import { Box, Button } from "@primer/react";
import { RocketIcon } from "@primer/octicons-react";
import { AbstractWidgetDefinition } from "../common/widgets/abstract-widget-definition";
import { WidgetConfigComponent, WidgetDisplayComponent } from "../common/widgets/types";
import { ValueBoardConfigItem } from "../components/value-board/value-board-config-item";
import { EmbeddedFilterListPayload } from "../components/filter-list/types";
import { ValueBoardDisplayItem } from "../components/value-board/value-board-display-item";
import { ConfigureWidgetEmptyState } from "../components/common/empty-states/configure-widget-empty-state";

export type ValueBoardItem =
  | { type: "unset"; name: string; preset: string }
  | {
      type: "filterListTotal";
      name: string;
      preset: string;
      filterList: EmbeddedFilterListPayload;
    }
  | {
      type: "repoStat";
      name: string;
      preset: string;
      repo: string;
      statKey: string;
      renderAs?: "date" | "string";
    }
  | {
      type: "npmDownloadCount";
      name: string;
      preset: string;
      packageName: string;
      range: string;
    };

type ValueBoardWidgetConfig = {
  items: ValueBoardItem[];
};

const ConfigComponent: WidgetConfigComponent<ValueBoardWidgetConfig> = ({ config, onChange }) => {
  return (
    <>
      {config.items.map((item, index) => (
        <ValueBoardConfigItem
          config={item}
          onChange={(newConfig) =>
            onChange({
              items: config.items.map((item, i) => (i === index ? newConfig : item)),
            })
          }
          onDelete={() =>
            onChange({
              items: config.items.filter((_, i) => i !== index),
            })
          }
          onSwap={(from, to) => {
            const fromIndex = config.items.indexOf(from);
            const toIndex = config.items.indexOf(to);
            if (fromIndex === -1 || toIndex === -1) {
              return;
            }
            const newItems = [...config.items];
            newItems[fromIndex] = to;
            newItems[toIndex] = from;
            onChange({ items: newItems });
          }}
        />
      ))}
      <Button onClick={() => onChange({ items: [...config.items, { type: "unset", name: "Item Name", preset: "" }] })}>
        Add new Item
      </Button>
    </>
  );
};

const DisplayComponent: WidgetDisplayComponent<ValueBoardWidgetConfig> = ({ config, onEdit }) => {
  if (config.items.length === 0) {
    return <ConfigureWidgetEmptyState onEdit={onEdit} />;
  }

  return (
    <Box
      sx={{ display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "flex-start", height: "100%" }}
    >
      {config.items.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ValueBoardDisplayItem config={item} key={index} />
      ))}
    </Box>
  );
};

export class ValueBoardWidget extends AbstractWidgetDefinition<ValueBoardWidgetConfig> {
  override id = "valueBoard";

  override name = "Value Board";

  override displayComponent = DisplayComponent;

  override configComponent = ConfigComponent;

  override iconComponent = () => <RocketIcon size={16} />;

  override generalIconComponent = () => <RocketIcon size={16} />;

  override async generateDefaultConfig(): Promise<ValueBoardWidgetConfig> {
    return {
      items: [],
    };
  }

  readonly defaultSize = [4, 1] as const;

  readonly minSize = [2, 1] as const;
}
