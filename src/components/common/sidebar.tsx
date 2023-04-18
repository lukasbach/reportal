import React, { FC } from "react";
import { ActionList, Box, Text } from "@primer/react";
import { Link, NavLink } from "react-router-dom";
import { GraphIcon } from "@primer/octicons-react";
import { useGetPinnedFilterLists } from "../../firebase/filter-lists";
import { EndpointIcon } from "./endpoint-icon";
import { useGetPinnedDashboards } from "../../firebase/dashboards";
import { useLogout } from "../../auth/hooks";

export type SidebarProps = {};

export const Sidebar: FC<SidebarProps> = ({}) => {
  const [dashboards] = useGetPinnedDashboards();
  const [filterLists] = useGetPinnedFilterLists();
  const { logout } = useLogout();
  return (
    <>
      <Box p={3}>
        <Link to="/app" className="unstyled-link">
          <Box fontSize={5} textAlign="center" sx={{ ":hover > :nth-child(2)": { color: "accent.fg" } }}>
            <Text>hello</Text>
            <Text fontWeight="bolder">GH</Text>
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
        <ActionList.Item onClick={logout}>Log Out</ActionList.Item>
      </ActionList>
    </>
  );
};
