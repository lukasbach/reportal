import React, { FC, PropsWithChildren, ReactNode } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { auth } from "./auth";
import { LoadingEmptyState } from "../components/common/empty-states/loading-empty-state";

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  if (loading) return <LoadingEmptyState />;
  if (!user) {
    navigate("/");
    return null;
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export const withAuthWrapper = (component: ReactNode) => <Wrapper>{component}</Wrapper>;
