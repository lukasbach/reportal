import { addDoc } from "firebase/firestore";
import { useStableHandler } from "../../utils";
import { useUserId } from "../../auth/hooks";
import { dashboardCollection, listCollection } from "../../firebase/db";
import { FilterListState } from "../filter-list/types";
import { DashboardConfigEntry } from "../../common/widgets/types";

type ImportedData = {
  lists: { data: FilterListState; id: string }[];
  dashboards: DashboardConfigEntry["state"][];
};

export const useImport = () => {
  const userId = useUserId();
  return useStableHandler(async (dataString: string) => {
    if (!userId || !dataString) {
      return;
    }

    const data: ImportedData = JSON.parse(dataString);
    const listOldToNewIdMap = new Map<string, string>();

    for (const list of data.lists) {
      const { id } = await addDoc(listCollection, { user: userId, state: list.data });
      listOldToNewIdMap.set(list.id, id);
    }

    for (const dashboard of data.dashboards) {
      for (const [oldListId, newListId] of listOldToNewIdMap) {
        dashboard.widgets = dashboard.widgets.replaceAll(oldListId, newListId);
      }
      await addDoc(dashboardCollection, {
        user: userId,
        state: dashboard,
      });
    }
  });
};
