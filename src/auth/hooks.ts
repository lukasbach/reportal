import { create } from "zustand";
import { combine } from "zustand/middleware";
import { useCallback, useMemo } from "react";
import { Octokit } from "@octokit/rest";
import { useAuthState, useDeleteUser, useSignInWithGithub, useSignOut } from "react-firebase-hooks/auth";
import { GithubAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from "./auth";

export const useTokenStore = create(
  combine({ token: localStorage.getItem("___gh") }, (set) => ({
    setToken: (token: string) => {
      set({ token });
      localStorage.setItem("___gh", token);
    },
    clearToken: () => {
      set({ token: undefined });
      localStorage.removeItem("___gh");
    },
  }))
);
export const useOctokit = () => {
  const token = useTokenStore((state) => state.token);
  return useMemo(() => new Octokit({ auth: token }), [token]);
};

export const useUserId = () => {
  const [user] = useAuthState(auth);
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

    useTokenStore.getState().setToken(token);
    navigate("/app/dashboards");
    return result;
  }, [navigate, signInWithGithub]);
  return { signIn, user, loading, error };
};

export const useLogout = () => {
  const navigate = useNavigate();
  const [signOut, loading, error] = useSignOut(auth);
  const logout = useCallback(async () => {
    useTokenStore.getState().clearToken();
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
    useTokenStore.getState().clearToken();
    return deleteUser();
  }, [deleteUser]);
  return { deleteAccount, loading, error };
};
