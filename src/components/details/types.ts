export type DetailsState =
  | {
      type: "issue";
      owner: string;
      repo: string;
      issue: number;
      isPr?: boolean;
      comment?: string;
    }
  | {
      type: "unset";
    };
