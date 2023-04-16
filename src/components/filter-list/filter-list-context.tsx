import React, { useContext, FC, createContext, PropsWithChildren } from "react";

import { ListEndpointDefinition } from "../../common/filter-lists/list-endpoint-definition";

export type FilterListContextType = {
  endpoint: ListEndpointDefinition;
  fields: string[];
  onChangeFields: (fields: string[]) => void;
  data: any[];
};
export const FilterListContext = createContext<FilterListContextType>({
  data: [],
  onChangeFields: () => {},
  endpoint: null as any,
  fields: [],
});
export const useFilterListContext = () => useContext(FilterListContext);
export const FilterListProvider: FC<PropsWithChildren<FilterListContextType>> = ({ children, ...ctx }) => (
  <FilterListContext.Provider value={ctx}>{children}</FilterListContext.Provider>
);
