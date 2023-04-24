import React, { FC } from "react";
import { ActionList, Box } from "@primer/react";
import { Link, NavLink } from "react-router-dom";
import {
  GearIcon,
  GraphIcon,
  MarkGithubIcon,
  PaintbrushIcon,
  TelescopeFillIcon,
  TelescopeIcon,
} from "@primer/octicons-react";
import { useGetPinnedFilterLists } from "../../firebase/filter-lists";
import { EndpointIcon } from "./endpoint-icon";
import { useGetPinnedDashboards } from "../../firebase/dashboards";
import { useLogout } from "../../auth/hooks";
import { ThemeSelector } from "../settings/theme-selector";

export type SidebarProps = {};

export const Sidebar: FC<SidebarProps> = () => {
  const [dashboards] = useGetPinnedDashboards();
  const [filterLists] = useGetPinnedFilterLists();
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
        <ThemeSelector>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <PaintbrushIcon size={16} />
            </ActionList.LeadingVisual>{" "}
            Color Theme
          </ActionList.Item>
        </ThemeSelector>

        <NavLink to="/app/settings" className="unstyled-link" end>
          {({ isActive }) => (
            <ActionList.Item active={isActive}>
              <ActionList.LeadingVisual>
                <GearIcon size={16} />
              </ActionList.LeadingVisual>
              Settings
            </ActionList.Item>
          )}
        </NavLink>

        <NavLink to="https://github.com/lukasbach/reportal" className="unstyled-link" target="_blank" end>
          {({ isActive }) => (
            <ActionList.Item active={isActive}>
              <ActionList.LeadingVisual>
                <MarkGithubIcon size={16} />
              </ActionList.LeadingVisual>
              Star on GitHub
            </ActionList.Item>
          )}
        </NavLink>

        <ActionList.Item onClick={logout}>Log Out</ActionList.Item>
      </ActionList>
    </>
  );
};
