import React from "react";
import { AbstractWidgetDefinition } from "./abstract-widget-definition";
import { WidgetConfigComponent, WidgetDisplayComponent } from "./types";
import { FilterListEmbeddedContainer } from "../components/filter-list/filter-list-embedded-container";
import { useFilterListData } from "../firebase/filter-lists";
import { FilterListSelector } from "../components/common/filter-list-selector";
import { EmbeddedFilterListPayload } from "../components/filter-list/types";
import { ConfigureWidgetEmptyState } from "../components/common/empty-states/configure-widget-empty-state";

type FilterListWidgetConfig = {
  filterList: EmbeddedFilterListPayload;
};

const ConfigComponent: WidgetConfigComponent<FilterListWidgetConfig> = ({ config, onChange }) => {
  return (
    <div>
      <FilterListSelector
        state={config.filterList}
        onChange={(newState) => {
          onChange({ filterList: newState });
        }}
      />
    </div>
  );
};

const DisplayComponent: WidgetDisplayComponent<FilterListWidgetConfig> = ({ config, actionsRef, onEdit }) => {
  const [filterList] = useFilterListData(config.filterList.type === "linked" ? config.filterList.id : null);
  const embeddedFilterList = config.filterList.type === "embedded" ? config.filterList : null;
  const data = embeddedFilterList?.state ?? filterList?.data()?.state;
  const id = filterList?.id;

  if (config.filterList.type === "unset") {
    return <ConfigureWidgetEmptyState onEdit={onEdit} />;
  }

  if (!data) {
    return null;
  }

  return (
    <FilterListEmbeddedContainer
      data={data}
      id={id ?? "embedded"}
      onChangeColSizing={console.log}
      actionsRef={actionsRef}
    />
  );
};

export class FilterListWidget extends AbstractWidgetDefinition<FilterListWidgetConfig> {
  override id = "filterList";

  override name = "Filter List";

  override displayComponent = DisplayComponent;

  override configComponent = ConfigComponent;

  override async generateDefaultConfig(): Promise<FilterListWidgetConfig> {
    return {
      filterList: {
        type: "unset",
      },
    };
  }

  readonly defaultSize = [5, 2] as const;
}
