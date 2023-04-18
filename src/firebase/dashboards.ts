import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { addDoc, deleteDoc, query, updateDoc, where } from "firebase/firestore";
import { dashboardCollection, getDashboardDoc } from "./db";
import { useStableHandler } from "../utils";
import { DashboardConfigEntry } from "../common/widgets/types";
import { useUserId } from "../auth/hooks";

export const useGetDashboards = () => useCollection(query(dashboardCollection, where("user", "==", useUserId())));

export const useGetPinnedDashboards = () =>
  useCollection(query(dashboardCollection, where("user", "==", useUserId()), where("state.pinned", "==", true)));
export const useDashboardData = (id: string | null) =>
  useDocument<DashboardConfigEntry>(id ? getDashboardDoc(id) : null);

export const useCreateDashboard = () => {
  const uid = useUserId();
  return useStableHandler(async () => {
    const entry: DashboardConfigEntry = {
      user: uid,
      state: {
        widgets: "{}",
        layouts: "{}",
        name: "New Dashboard",
        pinned: false,
      },
    };
    await addDoc(dashboardCollection, entry);
  });
};

export const useDeleteDashboard = () => {
  return useStableHandler(async (id: string) => {
    await deleteDoc(getDashboardDoc(id));
  });
};

export const useUpdateDashboard = () => {
  return useStableHandler(async (id: string, dashboard: DashboardConfigEntry) => {
    await updateDoc(getDashboardDoc(id), dashboard);
  });
};
