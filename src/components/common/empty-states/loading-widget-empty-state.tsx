import React, { FC } from "react";
import { Spinner } from "@primer/react";
import { EmptyState } from "./empty-state";

export const LoadingWidgetEmptyState: FC = () => {
  return <EmptyState text="Loading" primary={<Spinner />} />;
};
