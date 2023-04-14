import { limit, getDocs, query, where } from "firebase/firestore";
import { AbstractWidgetDefinition } from "./abstract-widget-definition";
import { WidgetDisplayComponent } from "./types";
import { listCollection } from "../firebase-app";
import { useAuthStore } from "../auth";

type FilterListWidgetConfig = {
  filterListId: string;
};

const DisplayComponent: WidgetDisplayComponent<FilterListWidgetConfig> = ({ payload }) => {
  return <div>Filter List Widget</div>;
};

export class FilterListWidget extends AbstractWidgetDefinition<FilterListWidgetConfig> {
  override id = "filterList";

  override name = "Filter List";

  override displayComponent = DisplayComponent;

  override configComponent = DisplayComponent;

  override async generateDefaultConfig(): Promise<FilterListWidgetConfig> {
    const snap = await getDocs(query(listCollection, where("user", "==", useAuthStore.getState().uid), limit(1)));
    const filterListId = snap.docs[0].id;
    return {
      filterListId,
    };
  }
}
