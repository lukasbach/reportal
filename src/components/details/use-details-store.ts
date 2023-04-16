import { create } from "zustand";
import { combine } from "zustand/middleware";
import { DetailsState } from "./types";

export const useDetailsStore = create(
  combine({ state: { type: "unset" } } as { state: DetailsState }, (set) => ({
    close: () => set({ state: { type: "unset" } }),
    openIssue: (owner: string, repo: string, issue: number, isPr = false) =>
      set({ state: { type: "issue", owner, repo, issue, isPr } }),
  }))
);
