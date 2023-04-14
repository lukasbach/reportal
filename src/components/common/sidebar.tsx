import React, { FC, ReactNode } from "react";
import { ActionList, Box, Text } from "@primer/react";
import { Link, NavLink } from "react-router-dom";
import { useGetPinnedFilterLists } from "../list-overview/hooks";

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
          <ActionList.Item>My Dashboard</ActionList.Item>
          <ActionList.Item>My Dashboard</ActionList.Item>
          <ActionList.Item>My Dashboard</ActionList.Item>
          <ActionList.Item>My Dashboard</ActionList.Item>
        </ActionList.Group>
        <ActionList.Divider />
        <ActionList.Group title="Filter Lists">
          {filterLists?.docs.map((item) => (
            <NavLink to={`/app/filterlists/${item.id}`} key={item.id} className="unstyled-link">
              {({ isActive }) => <ActionList.Item active={isActive}>{item.data().state.name}</ActionList.Item>}
            </NavLink>
          ))}
          <ActionList.Divider sx={{ mx: 3 }} />
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
