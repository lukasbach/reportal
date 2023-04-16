import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { create } from "zustand";
import { redirect } from "react-router";
import { Octokit } from "@octokit/rest";
import { firebaseApp } from "./firebase-app";

export const useAuthStore = create<{
  uid: string;
  token: string;
  displayName: string;
  email: string;
  kit: Octokit;
  isLoggedIn: boolean;
  ghName: string;
}>(
  () =>
    ({
      uid: undefined,
      token: undefined,
      displayName: undefined,
      email: undefined,
      isLoggedIn: false,
      kit: undefined,
      ghName: undefined,
    } as any)
);

export const setupAuthCallback = () => {
  console.log("setup");
  const auth = getAuth(firebaseApp);
  auth.onAuthStateChanged((user) => {
    console.log("onAuthStateChanged", user);
    if (user) {
      console.log("!!!", user);
      const { displayName, email, uid } = user;
      const token = localStorage.getItem("token");
      useAuthStore.setState({
        token: token ?? undefined,
        displayName: displayName ?? undefined,
        email: email ?? undefined,
        isLoggedIn: true,
        uid,
        kit: new Octokit({ auth: token }),
      });
      window.location.href = "#/app/filterlists/WRuk75n9Ma6bdt73SOYF";
    } else {
      localStorage.removeItem("token");
      useAuthStore.setState({
        token: undefined,
        displayName: undefined,
        email: undefined,
        isLoggedIn: false,
        kit: undefined,
        uid: undefined,
        ghName: undefined,
      });
    }
  });
};

export const login = async () => {
  const provider = new GithubAuthProvider();
  provider.addScope("repo");
  provider.addScope("user");

  const auth = getAuth(firebaseApp);

  const result = await signInWithPopup(auth, provider);
  const { displayName, email, uid } = result.user;
  const token = GithubAuthProvider.credentialFromResult(result)?.accessToken;
  localStorage.setItem("token", token ?? "");
  useAuthStore.setState({
    token: token ?? undefined,
    displayName: displayName ?? undefined,
    email: email ?? undefined,
    isLoggedIn: true,
    kit: new Octokit({ auth: token }),
    uid,
  });
  window.location.href = "#/app/filterlists/WRuk75n9Ma6bdt73SOYF";
};

export const authCheckLoader = () => {
  if (!useAuthStore.getState().isLoggedIn) {
    console.log(useAuthStore.getState());
    return redirect("/");
  }
  return null;
};

export const checkRedirectLoader = () => {};

setupAuthCallback();
