import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { addDoc, deleteDoc, query, updateDoc, where } from "firebase/firestore";
import { dashboardCollection, getDashboardDoc } from "./db";
import { useAuthStore } from "../auth";
import { useStableHandler } from "../utils";
import { DashboardConfigEntry } from "../widgets/types";

export const useGetDashboards = () =>
  useCollection(query(dashboardCollection, where("user", "==", useAuthStore().uid)));

export const useGetPinnedDashboards = () =>
  useCollection(query(dashboardCollection, where("user", "==", useAuthStore().uid), where("state.pinned", "==", true)));
export const useDashboardData = (id: string | null) =>
  useDocument<DashboardConfigEntry>(id ? getDashboardDoc(id) : null);

export const useCreateDashboard = () => {
  const { uid } = useAuthStore();
  return useStableHandler(async () => {
    const entry: DashboardConfigEntry = {
      user: uid,
      state: {
        widgets: {},
        layouts: {},
        name: "New Dashboard",
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
