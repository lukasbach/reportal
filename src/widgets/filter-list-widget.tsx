import React from "react";
import { AbstractWidgetDefinition } from "../common/widgets/abstract-widget-definition";
import { WidgetConfigComponent, WidgetDisplayComponent } from "../common/widgets/types";
import { FilterListEmbeddedContainer } from "../components/filter-list/filter-list-embedded-container";
import { useFilterListData } from "../firebase/filter-lists";
import { FilterListSelector } from "../components/common/filter-list-selector";
import { EmbeddedFilterListPayload } from "../components/filter-list/types";
import { ConfigureWidgetEmptyState } from "../components/common/empty-states/configure-widget-empty-state";
import { useUnwrapEmbeddedFilterListConfig } from "../components/filter-list/use-unwrap-embedded-filter-list-config";

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
  const { id, data } = useUnwrapEmbeddedFilterListConfig(config.filterList);

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
