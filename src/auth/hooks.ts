import { create } from "zustand";
import { combine } from "zustand/middleware";
import { useCallback, useMemo } from "react";
import { Octokit } from "@octokit/rest";
import { useAuthState, useDeleteUser, useSignInWithGithub, useSignOut } from "react-firebase-hooks/auth";
import { GithubAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from "./auth";

export const useGithubAuthStore = create(
  combine({ token: localStorage.getItem("___ght"), login: localStorage.getItem("___ghl") }, (set) => ({
    set: (token: string, login: string) => {
      set({ token, login });
      localStorage.setItem("___ght", token);
      localStorage.setItem("___ghl", login);
    },
    clear: () => {
      set({ token: undefined });
      localStorage.removeItem("___ght");
      localStorage.removeItem("___ghl");
    },
  }))
);
export const useOctokit = () => {
  const token = useGithubAuthStore((state) => state.token);
  return useMemo(() => new Octokit({ auth: token }), [token]);
};

export const useAuth = () => useAuthState(auth);

export const useUserId = () => {
  const [user] = useAuth();
  if (!user) {
    throw new Error("User is not logged in");
  }
  return user?.uid;
};

export const useLogin = () => {
  const navigate = useNavigate();
  const [signInWithGithub, user, loading, error] = useSignInWithGithub(auth);
  const signIn = useCallback(async () => {
    const result = await signInWithGithub(["repo", "user"]);
    if (!result) {
      return null;
    }

    const token = GithubAuthProvider.credentialFromResult(result)?.accessToken;
    if (!token) {
      throw new Error("Login was sucessful, but no github token could be retrieved.");
    }

    const kit = new Octokit({ auth: token });
    const {
      data: { login },
    } = await kit.users.getAuthenticated();

    useGithubAuthStore.getState().set(token, login);
    navigate("/app/dashboards");
    return result;
  }, [navigate, signInWithGithub]);
  return { signIn, user, loading, error };
};

export const useLogout = () => {
  const navigate = useNavigate();
  const [signOut, loading, error] = useSignOut(auth);
  const logout = useCallback(async () => {
    useGithubAuthStore.getState().clear();
    return signOut().then((r) => {
      navigate("/");
      return r;
    });
  }, [navigate, signOut]);
  return { logout, loading, error };
};
export const useDeleteAccount = () => {
  const [deleteUser, loading, error] = useDeleteUser(auth);
  const deleteAccount = useCallback(async () => {
    useGithubAuthStore.getState().clear();
    return deleteUser();
  }, [deleteUser]);
  return { deleteAccount, loading, error };
};
