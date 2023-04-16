export type FilterListState = {
  endpointId: string;
  search: string;
  fields: string[];
  fieldWidths: ColumnSizing;
  name: string;
  pinned: boolean;
};

export type FilterListStateEntry = {
  state: FilterListState;
  user: string;
};

export type EmbeddedFilterListPayload =
  | {
      type: "linked";
      id: string;
    }
  | {
      type: "embedded";
      state: FilterListState;
    }
  | {
      type: "unset";
    };

export type ColumnSizing = Record<string, number>;
export type RowSelection = Record<number, boolean>;
