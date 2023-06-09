import {
  collection,
  doc,
  DocumentReference,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  CollectionReference,
} from "firebase/firestore";
import { FilterListStateEntry } from "../components/filter-list/types";
import { firebaseApp } from "../firebase-app";
import { DashboardConfigEntry } from "../common/widgets/types";

export const db = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

export const listCollection = collection(db, "lists") as CollectionReference<FilterListStateEntry>;

export const getListDoc = (id: string) => doc(db, "lists", id) as DocumentReference<FilterListStateEntry>;

export const dashboardCollection = collection(db, "dashboards") as CollectionReference<DashboardConfigEntry>;

export const getDashboardDoc = (id: string) => doc(db, "dashboards", id) as DocumentReference<DashboardConfigEntry>;
