import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { deleteDoc, addDoc, updateDoc, query, where } from "firebase/firestore";
import { getListDoc, listCollection } from "../../firebase-app";
import { useAuthStore } from "../../auth";
import { useStableHandler } from "../../utils";
import { FilterListStateEntry } from "../filter-list/types";

export const useGetFilterLists = () => useCollection(query(listCollection, where("user", "==", useAuthStore().uid)));

export const useGetPinnedFilterLists = () =>
  useCollection(query(listCollection, where("user", "==", useAuthStore().uid), where("state.pinned", "==", true)));
export const useFilterListData = (id: string | null) => useDocument<FilterListStateEntry>(id ? getListDoc(id) : null);

export const useCreateFilterList = () => {
  const { uid } = useAuthStore();
  return useStableHandler(async () => {
    const entry: FilterListStateEntry = {
      user: uid,
      state: {
        search: "type:issue assignee:@me state:open",
        fields: ["number", "title", "author"],
        fieldWidths: {},
        endpointId: "",
        name: "My new List",
        pinned: false,
      },
    };
    await addDoc(listCollection, entry);
  });
};

export const useDeleteFilterList = () => {
  return useStableHandler(async (id: string) => {
    await deleteDoc(getListDoc(id));
  });
};

export const useUpdateFilterList = () => {
  return useStableHandler(async (id: string, list: FilterListStateEntry) => {
    await updateDoc(getListDoc(id), list);
  });
};
