import React, { FC, ReactNode } from "react";
import { useCreateList, useGetLists } from "./hooks";

export const ListsOverviewPage: FC = () => {
  const [value, loading, error] = useGetLists();
  console.log(
    "items",
    { value, loading, error },
    value?.docs.map((d) => d.data())
  );
  const createItem = useCreateList();
  return <button onClick={createItem}>create</button>;
};
