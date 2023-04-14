import React, { FC, ReactNode } from "react";
import { ActionList, Box, Text } from "@primer/react";
import { Link, NavLink } from "react-router-dom";
import { GraphIcon } from "@primer/octicons-react";
import { useGetPinnedFilterLists } from "../list-overview/hooks";
import { EndpointIcon } from "./endpoint-icon";

export type SidebarProps = {};

export const Sidebar: FC<SidebarProps> = ({}) => {
  const [filterLists] = useGetPinnedFilterLists();
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
          <NavLink to="/app/dashboards" className="unstyled-link" end>
            {({ isActive }) => (
              <ActionList.Item active={isActive}>
                <ActionList.LeadingVisual>
                  <GraphIcon size={16} />
                </ActionList.LeadingVisual>
                Home
              </ActionList.Item>
            )}
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
            {({ isActive }) => <ActionList.Item active={isActive}>Show all</ActionList.Item>}
          </NavLink>
        </ActionList.Group>
        <ActionList.Divider />
        <ActionList.Item>Settings</ActionList.Item>
        <ActionList.Item>Log Out</ActionList.Item>
      </ActionList>
    </>
  );
};
