import React, { FC } from "react";
import { ActionList, ActionMenu, Box, Text } from "@primer/react";
import { Link, NavLink } from "react-router-dom";
import { GraphIcon, MoonIcon, PaintbrushIcon, SunIcon, TelescopeFillIcon, TelescopeIcon } from "@primer/octicons-react";
import { useGetPinnedFilterLists } from "../../firebase/filter-lists";
import { EndpointIcon } from "./endpoint-icon";
import { useGetPinnedDashboards } from "../../firebase/dashboards";
import { useLogout } from "../../auth/hooks";
import { ColorMode, useColorModeStore } from "./theme/use-color-mode-store";

export type SidebarProps = {};

export const Sidebar: FC<SidebarProps> = () => {
  const [dashboards] = useGetPinnedDashboards();
  const [filterLists] = useGetPinnedFilterLists();
  const colorMode = useColorModeStore((state) => state.mode);
  const setColorMode = useColorModeStore((state) => state.set);
  const { logout } = useLogout();

  return (
    <>
      <Box p={3}>
        <Link to="/app/dashboards" className="unstyled-link">
          <Box
            fontSize={5}
            textAlign="center"
            sx={{
              " svg:nth-child(2)": { display: "none !important" },
              ":hover > svg:nth-child(1)": { display: "none !important" },
              ":hover > svg:nth-child(2)": { display: "inline-block !important" },
            }}
          >
            <TelescopeIcon size={38} />
            <TelescopeFillIcon size={38} />
            {/* <Text fontFamily="Ubuntu" fontWeight="700" fontSize="30px" ml={2}>
              hello
            </Text>
            <Text fontFamily="Ubuntu" fontWeight="700" fontSize="30px" color="accent.fg">
              GH
            </Text> */}
          </Box>
        </Link>
      </Box>

      <ActionList>
        <ActionList.Group title="Dashboards">
          {dashboards?.docs.map((item) => (
            <NavLink to={`/app/dashboards/${item.id}`} key={item.id} className="unstyled-link">
              {({ isActive }) => (
                <ActionList.Item active={isActive}>
                  <ActionList.LeadingVisual>
                    <GraphIcon size={16} />
                  </ActionList.LeadingVisual>
                  {item.data().state.name}
                </ActionList.Item>
              )}
            </NavLink>
          ))}

          <NavLink to="/app/dashboards" className="unstyled-link" end>
            {({ isActive }) => <ActionList.Item active={isActive}>All Dashboards</ActionList.Item>}
          </NavLink>
        </ActionList.Group>

        <ActionList.Divider />

        <ActionList.Group title="Filter Lists">
          {filterLists?.docs.map((item) => (
            <NavLink to={`/app/filterlists/${item.id}`} key={item.id} className="unstyled-link">
              {({ isActive }) => (
                <ActionList.Item active={isActive}>
                  <ActionList.LeadingVisual>
                    <EndpointIcon endpointId={item.data().state.endpointId} size={16} />
                  </ActionList.LeadingVisual>
                  {item.data().state.name}
                </ActionList.Item>
              )}
            </NavLink>
          ))}

          <NavLink to="/app/filterlists" className="unstyled-link" end>
            {({ isActive }) => <ActionList.Item active={isActive}>All Filter Lists</ActionList.Item>}
          </NavLink>
        </ActionList.Group>
        <ActionList.Divider />
        <ActionMenu>
          <ActionMenu.Anchor>
            <ActionList.Item>Color Theme</ActionList.Item>
          </ActionMenu.Anchor>

          <ActionMenu.Overlay>
            <ActionList selectionVariant="single">
              <ActionList.Item selected={colorMode === ColorMode.Auto} onClick={() => setColorMode(ColorMode.Auto)}>
                <ActionList.TrailingVisual>
                  <PaintbrushIcon />
                </ActionList.TrailingVisual>
                Auto
              </ActionList.Item>
              <ActionList.Item selected={colorMode === ColorMode.Light} onClick={() => setColorMode(ColorMode.Light)}>
                <ActionList.TrailingVisual>
                  <SunIcon />
                </ActionList.TrailingVisual>
                Light
              </ActionList.Item>
              <ActionList.Item selected={colorMode === ColorMode.Dark} onClick={() => setColorMode(ColorMode.Dark)}>
                <ActionList.TrailingVisual>
                  <MoonIcon />
                </ActionList.TrailingVisual>
                Dark
              </ActionList.Item>
              <ActionList.Item
                selected={colorMode === ColorMode.DarkDimmed}
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
        <ActionList.Item onClick={logout}>Log Out</ActionList.Item>
      </ActionList>
    </>
  );
};
