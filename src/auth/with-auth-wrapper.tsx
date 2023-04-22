import React, { FC, PropsWithChildren, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { LoadingEmptyState } from "../components/common/empty-states/loading-empty-state";
import { useLogout, useGithubAuthStore, useAuth } from "./hooks";

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  const { logout } = useLogout();
  const [user, loading] = useAuth();
  const navigate = useNavigate();
  const token = useGithubAuthStore((state) => state.token);

  useEffect(() => {
    if (user && !token) {
      console.log("User is logged in, but no token is present. Logging out.");
      logout();
    }
  }, [logout, token, user]);

  if (loading) {
    return <LoadingEmptyState />;
  }

  if (!user) {
    navigate("/");
    return null;
  }
  if (!token) {
    return null;
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export const withAuthWrapper = (component: ReactNode) => <Wrapper>{component}</Wrapper>;
