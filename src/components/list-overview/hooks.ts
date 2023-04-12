import { useCollection } from "react-firebase-hooks/firestore";
import { addDoc, query, where } from "firebase/firestore";
import { firebaseApp, listCollection } from "../../firebase-app";
import { useAuthStore } from "../../auth";
import { useStableHandler } from "../../utils";
import { FilterListStateEntry } from "../filter-list/types";

export const useGetFilterLists = () =>
  useCollection(query(listCollection, where("user", "==", useAuthStore().uid)), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

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
