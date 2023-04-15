import { limit, getDocs, query, where } from "firebase/firestore";
import React from "react";
import { AbstractWidgetDefinition } from "./abstract-widget-definition";
import { WidgetConfigComponent, WidgetDisplayComponent } from "./types";
import { listCollection } from "../firebase-app";
import { useAuthStore } from "../auth";
import { FilterListEmbeddedContainer } from "../components/filter-list/filter-list-embedded-container";
import { useFilterListData } from "../components/list-overview/hooks";

type FilterListWidgetConfig = {
  filterListId: string;
};

const ConfigComponent: WidgetConfigComponent<FilterListWidgetConfig> = ({ config }) => {
  return <div>Filter List Widget</div>;
};

const DisplayComponent: WidgetDisplayComponent<FilterListWidgetConfig> = ({ config, actionsRef }) => {
  const [filterList] = useFilterListData(config.filterListId);
  const data = filterList?.data();
  const id = filterList?.id;

  if (!data || !id) {
    return null;
  }

  return (
    <FilterListEmbeddedContainer data={data.state} id={id} onChangeColSizing={console.log} actionsRef={actionsRef} />
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
      filterListId,
    };
  }
}
