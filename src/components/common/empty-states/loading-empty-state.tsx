import React, { FC } from "react";
import { Spinner } from "@primer/react";
import { EmptyState } from "./empty-state";

export const LoadingEmptyState: FC = () => {
  return <EmptyState text="Loading" primary={<Spinner />} />;
};
