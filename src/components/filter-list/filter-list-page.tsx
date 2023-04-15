import React, { FC } from "react";
import { useParams } from "react-router";
import { useFilterListData, useUpdateFilterList } from "../../firebase/filter-lists";
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
      id={id}
      data={data.state}
      onUpdate={(newId, newData) => {
        console.log("Updating", newId, newData.name, "to firebase");
        update(newId, { state: newData, user: data.user });
      }}
    />
  );
};
