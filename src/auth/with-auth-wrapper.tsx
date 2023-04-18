import React, { FC, PropsWithChildren, ReactNode, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { auth } from "./auth";
import { LoadingEmptyState } from "../components/common/empty-states/loading-empty-state";
import { useLogout, useTokenStore } from "./hooks";

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  const { logout } = useLogout();
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const token = useTokenStore((state) => state.token);

  useEffect(() => {
    if (user && !token) {
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
