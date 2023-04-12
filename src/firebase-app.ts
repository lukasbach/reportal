import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { CollectionReference } from "@firebase/firestore";
import { ListStateEntry } from "./components/list/types";

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyDoZH7_ayqubAq909vnrlzMCqGnDkj1sNc",
  authDomain: "hellogh.firebaseapp.com",
  projectId: "hellogh",
  storageBucket: "hellogh.appspot.com",
  messagingSenderId: "526679845036",
  appId: "1:526679845036:web:bca007b24e61289d3d5709",
});

export const db = getFirestore(firebaseApp);

export const listCollection = collection(getFirestore(firebaseApp), "lists") as CollectionReference<ListStateEntry>;
