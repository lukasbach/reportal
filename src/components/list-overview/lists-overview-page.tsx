import React, { FC, ReactNode } from "react";
import { useCreateFilterList, useGetFilterLists } from "./hooks";

export const ListsOverviewPage: FC = () => {
  const [value, loading, error] = useGetFilterLists();
  console.log(
    "items",
    { value, loading, error },
    value?.docs.map((d) => d.data())
  );
  const createItem = useCreateFilterList();
  return <button onClick={createItem}>create</button>;
};
