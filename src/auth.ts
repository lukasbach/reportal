import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { create } from "zustand";
import { redirect } from "react-router";
import { firebaseApp } from "./main";

const useAuthStore = create<{ token?: string; displayName?: string; email?: string; isLoggedIn: boolean }>(() => ({
  token: undefined,
  displayName: undefined,
  email: undefined,
  isLoggedIn: false,
}));

export const login = async () => {
  const provider = new GithubAuthProvider();
  provider.addScope("repo");
  provider.addScope("user");

  const auth = getAuth(firebaseApp);

  const result = await signInWithPopup(auth, provider);
  const { displayName, email } = result.user;
  const token = GithubAuthProvider.credentialFromResult(result)?.accessToken;
  console.log("Token", token);
  useAuthStore.setState({
    token: token ?? undefined,
    displayName: displayName ?? undefined,
    email: email ?? undefined,
    isLoggedIn: true,
  });
  window.location.href = "#/app/dashboard";
};

export const authCheckLoader = () => {
  if (!useAuthStore.getState().isLoggedIn) {
    console.log(useAuthStore.getState());
    return redirect("/");
  }
  return null;
};

export const checkRedirectLoader = () => {};
