export type ListState = {
  endpointId: string;
  search: string;
  fields: string[];
  fieldWidths: Record<string, number>;
  name: string;
  pinned: boolean;
};

export type ListStateEntry = {
  state: ListState;
  user: string;
};
