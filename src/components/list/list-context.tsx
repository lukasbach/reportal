import React, { useContext, FC, createContext, PropsWithChildren } from "react";
import { ListEndpointDefinition } from "../../list-endpoints/types";

export type ListContextType = {
  endpoint: ListEndpointDefinition;
  fields: string[];
  onChangeFields: (fields: string[]) => void;
  data: any[];
};
export const ListContext = createContext<ListContextType>({
  data: [],
  onChangeFields: () => {},
  endpoint: null as any,
  fields: [],
});
export const useListContext = () => useContext(ListContext);
export const ListProvider: FC<PropsWithChildren<ListContextType>> = ({ children, ...ctx }) => (
  <ListContext.Provider value={ctx}>{children}</ListContext.Provider>
);
