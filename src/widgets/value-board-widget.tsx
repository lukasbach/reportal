import React from "react";
import { Box, Button } from "@primer/react";
import { AbstractWidgetDefinition } from "./abstract-widget-definition";
import { WidgetConfigComponent, WidgetDisplayComponent } from "./types";
import { ValueBoardConfigItem } from "../components/value-board/value-board-config-item";
import { EmbeddedFilterListPayload } from "../components/filter-list/types";
import { ValueBoardDisplayItem } from "../components/value-board/value-board-display-item";

export type ValueBoardItem =
  | { type: "unset"; name: string }
  | {
      type: "filterListTotal";
      name: string;
      filterList: EmbeddedFilterListPayload;
    }
  | {
      type: "repoStargazerCount";
      name: string;
      repo: string;
    };

export const valueBoardItemTypes: Record<string, { name: string; initial: ValueBoardItem }> = {
  filterListTotal: {
    name: "Filter List Total",
    initial: { type: "filterListTotal", name: "Filter List Count", filterList: { type: "unset" } },
  },
  repoStargazerCount: {
    name: "Repo Stargazer Count",
    initial: { type: "repoStargazerCount", name: "Repo Stargazers", repo: "octocat/hello-world" },
  },
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
        />
      ))}
      <Button onClick={() => onChange({ items: [...config.items, { type: "unset", name: "Item Name" }] })}>
        Add new Item
      </Button>
    </>
  );
};

const DisplayComponent: WidgetDisplayComponent<ValueBoardWidgetConfig> = ({ config, actionsRef, onEdit }) => {
  return (
    <Box
      sx={{ display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "flex-start", height: "100%" }}
    >
      {config.items.map((item, index) => (
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

  override async generateDefaultConfig(): Promise<ValueBoardWidgetConfig> {
    return {
      items: [],
    };
  }

  readonly defaultSize = [4, 1] as const;
}
