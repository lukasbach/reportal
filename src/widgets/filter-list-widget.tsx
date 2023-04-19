import React from "react";
import { IssueOpenedIcon } from "@primer/octicons-react";
import { AbstractWidgetDefinition } from "../common/widgets/abstract-widget-definition";
import { WidgetConfigComponent, WidgetDisplayComponent } from "../common/widgets/types";
import { FilterListEmbeddedContainer } from "../components/filter-list/filter-list-embedded-container";
import { FilterListSelector } from "../components/common/filter-list-selector";
import { EmbeddedFilterListPayload } from "../components/filter-list/types";
import { ConfigureWidgetEmptyState } from "../components/common/empty-states/configure-widget-empty-state";
import { useUnwrapEmbeddedFilterListConfig } from "../components/filter-list/use-unwrap-embedded-filter-list-config";
import { LoadingEmptyState } from "../components/common/empty-states/loading-empty-state";
import { EndpointIcon } from "../components/common/endpoint-icon";

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

const DisplayComponent: WidgetDisplayComponent<FilterListWidgetConfig> = ({ config, actionsRef, onEdit, onChange }) => {
  const { id, data } = useUnwrapEmbeddedFilterListConfig(config.filterList);

  if (config.filterList.type === "unset") {
    return <ConfigureWidgetEmptyState onEdit={onEdit} />;
  }

  if (!data) {
    return <LoadingEmptyState />;
  }

  return (
    <FilterListEmbeddedContainer
      data={data}
      id={id ?? "embedded"}
      onChangeColSizing={(id, fieldWidths) => {
        onChange({
          ...config,
          filterList: {
            ...config.filterList,
            ...(config.filterList.type === "embedded" ? { state: { ...config.filterList.state, fieldWidths } } : {}),
          },
        });
      }}
      actionsRef={actionsRef}
    />
  );
};

export class FilterListWidget extends AbstractWidgetDefinition<FilterListWidgetConfig> {
  override id = "filterList";

  override name = "Filter List";

  override displayComponent = DisplayComponent;

  override configComponent = ConfigComponent;

  override iconComponent = ({ config }) => {
    const { data } = useUnwrapEmbeddedFilterListConfig(config.filterList);
    return <EndpointIcon endpointId={data?.endpointId ?? null} />;
  };

  override generalIconComponent = () => <IssueOpenedIcon size={16} />;

  override async generateDefaultConfig(): Promise<FilterListWidgetConfig> {
    return {
      filterList: {
        type: "unset",
      },
    };
  }

  readonly defaultSize = [5, 2] as const;
}
