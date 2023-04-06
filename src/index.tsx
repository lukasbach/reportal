import React from "react";
import ReactDOM from "react-dom/client";

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const app = initializeApp({
  apiKey: "AIzaSyDoZH7_ayqubAq909vnrlzMCqGnDkj1sNc",
  authDomain: "hellogh.firebaseapp.com",
  projectId: "hellogh",
  storageBucket: "hellogh.appspot.com",
  messagingSenderId: "526679845036",
  appId: "1:526679845036:web:bca007b24e61289d3d5709",
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<React.StrictMode>Hello</React.StrictMode>);
