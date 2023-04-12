import { useCollection } from "react-firebase-hooks/firestore";
import { addDoc, query, where } from "firebase/firestore";
import { firebaseApp, listCollection } from "../../firebase-app";
import { useAuthStore } from "../../auth";
import { useStableHandler } from "../../utils";
import { ListStateEntry } from "../list/types";

export const useGetLists = () =>
  useCollection(query(listCollection, where("user", "==", useAuthStore().uid)), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

export const useCreateList = () => {
  const { uid } = useAuthStore();
  return useStableHandler(async () => {
    const entry: ListStateEntry = {
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
