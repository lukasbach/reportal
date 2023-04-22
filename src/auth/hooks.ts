import { create } from "zustand";
import { combine } from "zustand/middleware";
import { useCallback, useEffect, useMemo } from "react";
import { Octokit } from "@octokit/rest";
import {
  useAuthState,
  useDeleteUser,
  useSignInWithGithub,
  useSignOut,
  useSendSignInLinkToEmail,
  useSignInWithEmailLink,
} from "react-firebase-hooks/auth";
import { GithubAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from "./auth";
import { useStableHandler } from "../utils";

export const useGithubAuthStore = create(
  combine({ token: localStorage.getItem("___ght"), login: localStorage.getItem("___ghl") }, (set) => ({
    set: (token: string, login: string) => {
      console.log("!!SET", token, login, "!!SET");
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

export const useAuth = () => useAuthState(auth);

export const useUserId = () => {
  const [user] = useAuth();
  if (!user) {
    throw new Error("User is not logged in");
  }
  return user?.uid;
};

export const useRedirectToAppIfLoggedIn = () => {
  const navigate = useNavigate();
  const [user] = useAuth();
  const token = useGithubAuthStore((state) => state.token);
  useEffect(() => {
    if (user && token) {
      navigate("/app/dashboards");
    }
  }, [user, navigate, token]);
};

export const useCompleteLogin = () => {
  const navigate = useNavigate();
  return useStableHandler(async (token: string) => {
    try {
      const kit = new Octokit({ auth: token });
      const {
        data: { login },
      } = await kit.users.getAuthenticated();

      useGithubAuthStore.getState().set(token, login);
      navigate("/app/dashboards");
    } catch (e) {
      console.error(e);
      alert(`Login failed: ${e.message}`);
    }
  });
};

export const useLogin = () => {
  const completeLogin = useCompleteLogin();
  const [signInWithGithub, user, loading, error] = useSignInWithGithub(auth);
  const signIn = useCallback(
    async (scopes = ["repo", "user"]) => {
      const result = await signInWithGithub(scopes);
      if (!result) {
        return null;
      }

      const token = GithubAuthProvider.credentialFromResult(result)?.accessToken;
      if (!token) {
        throw new Error("Login was sucessful, but no github token could be retrieved.");
      }

      await completeLogin(token);

      return result;
    },
    [completeLogin, signInWithGithub]
  );
  return { signIn, user, loading, error };
};

export const useTokenLogin = () => {
  const [sendSignInLinkToEmail, user, loading] = useSendSignInLinkToEmail(auth);
  const navigate = useNavigate();
  const signIn = useCallback(
    async (email: string, token: string) => {
      const actionCodeSettings = {
        url: "http://localhost:5173/", // TODO
        handleCodeInApp: true,
      };
      const success = await sendSignInLinkToEmail(email, actionCodeSettings);
      localStorage.setItem("__signin-email", email);
      localStorage.setItem("___ght", token);

      if (success) {
        navigate("/token-login/mail-sent");
      } else {
        alert("Failed to send email. Please try to use direct login through github instead.");
      }

      return success;
    },
    [navigate, sendSignInLinkToEmail]
  );
  return { signIn, user, loading };
};

export const useAttemptToCompleteTokenLogin = () => {
  const [signInWithEmailLink] = useSignInWithEmailLink(auth);
  const completeLogin = useCompleteLogin();
  useEffect(() => {
    if (new URL(window.location.href).searchParams.has("apiKey")) {
      const email = localStorage.getItem("__signin-email");
      if (email) {
        signInWithEmailLink(email).then((result) => {
          const token = localStorage.getItem("___ght");
          if (!token || !result) {
            throw new Error("Login failed");
          }
          completeLogin(token);
        });
      }
    }
  }, [completeLogin, signInWithEmailLink]);
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

export const useOctokit = () => {
  const { logout } = useLogout();
  const token = useGithubAuthStore((state) => state.token);
  useEffect(() => {
    if (!token) {
      console.log("No token in storage available for octokit, logging out.");
      logout();
    }
  }, [token, logout]);
  return useMemo(() => new Octokit({ auth: token }), [token]);
};
