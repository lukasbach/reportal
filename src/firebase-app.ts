import { initializeApp } from "firebase/app";
import { collection, doc, getFirestore, DocumentReference } from "firebase/firestore";
import { CollectionReference } from "@firebase/firestore";
import firebase from "firebase/compat";
import { FilterListStateEntry } from "./components/filter-list/types";

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyDoZH7_ayqubAq909vnrlzMCqGnDkj1sNc",
  authDomain: "hellogh.firebaseapp.com",
  projectId: "hellogh",
  storageBucket: "hellogh.appspot.com",
  messagingSenderId: "526679845036",
  appId: "1:526679845036:web:bca007b24e61289d3d5709",
});
