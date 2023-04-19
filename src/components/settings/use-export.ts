import { getDocs, query, where } from "firebase/firestore";
import { useStableHandler } from "../../utils";
import { useUserId } from "../../auth/hooks";
import { dashboardCollection, listCollection } from "../../firebase/db";

export const useExport = () => {
  const userId = useUserId();
  return useStableHandler(async () => {
    if (!userId) {
      return;
    }
    const dashboardSnapshot = await getDocs(query(dashboardCollection, where("user", "==", userId)));
    const dashboards = dashboardSnapshot.docs.map((d) => d.data().state);

    const listSnapshot = await getDocs(query(listCollection, where("user", "==", userId)));
    const lists = listSnapshot.docs.map((d) => ({ data: d.data().state, id: d.id }));

    const exportData = { lists, dashboards };

    const dataString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData))}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataString);
    downloadAnchorNode.setAttribute("download", "github-portal-export.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  });
};
