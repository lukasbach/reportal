import React, { FC, ReactNode } from "react";
import { ActionList, ActionMenu } from "@primer/react";
import { MoonIcon, PaintbrushIcon, SunIcon } from "@primer/octicons-react";
import { ColorMode, useColorModeStore } from "../common/theme/use-color-mode-store";

export type ThemeSelectorProps = {
  children: ReactNode;
};

export const ThemeSelector: FC<ThemeSelectorProps> = ({ children }) => {
  const colorMode = useColorModeStore((state) => state.mode);
  const setColorMode = useColorModeStore((state) => state.set);
  return (
    <ActionMenu>
      <ActionMenu.Anchor>{children as any}</ActionMenu.Anchor>

      <ActionMenu.Overlay>
        <ActionList>
          <ActionList.Item active={colorMode === ColorMode.Auto} onClick={() => setColorMode(ColorMode.Auto)}>
            <ActionList.TrailingVisual>
              <PaintbrushIcon />
            </ActionList.TrailingVisual>
            Auto
          </ActionList.Item>
          <ActionList.Item active={colorMode === ColorMode.Light} onClick={() => setColorMode(ColorMode.Light)}>
            <ActionList.TrailingVisual>
              <SunIcon />
            </ActionList.TrailingVisual>
            Light
          </ActionList.Item>
          <ActionList.Item active={colorMode === ColorMode.Dark} onClick={() => setColorMode(ColorMode.Dark)}>
            <ActionList.TrailingVisual>
              <MoonIcon />
            </ActionList.TrailingVisual>
            Dark
          </ActionList.Item>
          <ActionList.Item
            active={colorMode === ColorMode.DarkDimmed}
            onClick={() => setColorMode(ColorMode.DarkDimmed)}
          >
            <ActionList.TrailingVisual>
              <MoonIcon />
            </ActionList.TrailingVisual>
            Dark Dimmed
          </ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  );
};
