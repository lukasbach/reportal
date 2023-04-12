import React, { FC } from "react";
import { useParams } from "react-router";
import { useFilterListData, useUpdateFilterList } from "../list-overview/hooks";
import { FilterListContainer } from "./filter-list-container";

export const FilterListPage: FC = () => {
  const { id } = useParams();
  const [value] = useFilterListData(id ?? null);
  const update = useUpdateFilterList();
  const data = value?.data();
  if (!data || !id) {
    return null;
  }
  return (
    <FilterListContainer
      data={data.state}
      onUpdate={(newData) => {
        console.log("Updating", newData.name, "to firebase");
        update(id, { state: newData, user: data.user });
      }}
    />
  );
};
