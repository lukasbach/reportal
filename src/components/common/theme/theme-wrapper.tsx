import React, { FC, ReactNode, useEffect } from "react";
import { ThemeProvider } from "@primer/react";
import { ColorMode, useColorModeStore } from "./use-color-mode-store";

export type ThemeWrapperProps = {
  children: ReactNode;
};

export const ThemeWrapper: FC<ThemeWrapperProps> = ({ children }) => {
  const mode = useColorModeStore((state) => state.mode);

  useEffect(() => {
    document.getElementById("scrollbar-style")?.remove();
    const style = document.createElement("style");
    style.id = "scrollbar-style";
    const isBrowserDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark =
      mode === ColorMode.Dark || mode === ColorMode.DarkDimmed || (mode === ColorMode.Auto && isBrowserDark);
    style.innerHTML = isDark ? `:root { color-scheme: dark; }` : "";
    document.head.appendChild(style);
  }, [mode]);
  return (
    <ThemeProvider
      // eslint-disable-next-line no-nested-ternary
      colorMode={mode === ColorMode.Auto ? "auto" : mode === ColorMode.Light ? "day" : "night"}
      nightScheme={mode === ColorMode.DarkDimmed ? "dark_dimmed" : "dark"}
    >
      {children}
    </ThemeProvider>
  );
};
