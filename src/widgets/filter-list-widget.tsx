import { limit, getDocs, query, where } from "firebase/firestore";
import React from "react";
import { AbstractWidgetDefinition } from "./abstract-widget-definition";
import { WidgetConfigComponent, WidgetDisplayComponent } from "./types";
import { listCollection } from "../firebase-app";
import { useAuthStore } from "../auth";
import { FilterListEmbeddedContainer } from "../components/filter-list/filter-list-embedded-container";
import { useFilterListData } from "../components/list-overview/hooks";
import { FilterListSelector } from "../components/common/filter-list-selector";
import { EmbeddedFilterListPayload } from "../components/filter-list/types";

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

const DisplayComponent: WidgetDisplayComponent<FilterListWidgetConfig> = ({ config, actionsRef }) => {
  const [filterList] = useFilterListData(config.filterList.type === "linked" ? config.filterList.id : null);
  const embeddedFilterList = config.filterList.type === "embedded" ? config.filterList : null;
  const data = embeddedFilterList?.state ?? filterList?.data()?.state;
  const id = filterList?.id;

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
    const snap = await getDocs(query(listCollection, where("user", "==", useAuthStore.getState().uid), limit(1)));
    const filterListId = snap.docs[0].id;
    return {
      filterList: {
        type: "unset",
      },
    };
  }
}
