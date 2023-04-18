import { create } from "zustand";
import { combine } from "zustand/middleware";

export enum ColorMode {
  Auto,
  Light,
  Dark,
  DarkDimmed,
}

export const useColorModeStore = create(
  combine({ mode: ColorMode.Auto }, (set) => ({
    set: (mode: ColorMode) => {
      set({ mode });
    },
  }))
);
