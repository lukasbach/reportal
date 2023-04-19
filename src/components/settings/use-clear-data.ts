import { deleteDoc, getDocs, query, where } from "firebase/firestore";
import { useStableHandler } from "../../utils";
import { useUserId } from "../../auth/hooks";
import { dashboardCollection, listCollection } from "../../firebase/db";

export const useClearData = () => {
  const userId = useUserId();
  return useStableHandler(async () => {
    if (!userId) {
      return;
    }

    const dashboardSnapshot = await getDocs(query(dashboardCollection, where("user", "==", userId)));
    for (const { ref } of dashboardSnapshot.docs) {
      await deleteDoc(ref);
    }

    const listSnapshot = await getDocs(query(listCollection, where("user", "==", userId)));
    for (const { ref } of listSnapshot.docs) {
      await deleteDoc(ref);
    }
  });
};
