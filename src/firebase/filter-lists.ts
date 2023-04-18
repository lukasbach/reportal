import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { deleteDoc, addDoc, updateDoc, query, where, orderBy } from "firebase/firestore";
import { getListDoc, listCollection } from "./db";
import { useStableHandler } from "../utils";
import { FilterListStateEntry } from "../components/filter-list/types";

import { ListEndpointDefinition } from "../common/filter-lists/list-endpoint-definition";
import { useUserId } from "../auth/hooks";

export const useGetFilterLists = () =>
  useCollection(query(listCollection, where("user", "==", useUserId()), orderBy("state.name")));

export const useGetPinnedFilterLists = () =>
  useCollection(
    query(listCollection, where("user", "==", useUserId()), where("state.pinned", "==", true), orderBy("state.name"))
  );
export const useFilterListData = (id: string | null) => useDocument<FilterListStateEntry>(id ? getListDoc(id) : null);

export const useCreateFilterList = () => {
  const uid = useUserId();
  return useStableHandler(async (endpoint: ListEndpointDefinition) => {
    const entry: FilterListStateEntry = {
      user: uid,
      state: endpoint.defaultData,
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
