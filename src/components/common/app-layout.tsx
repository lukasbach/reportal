import React, { FC } from "react";
import { Outlet } from "react-router";
import { useFetchListItems } from "../../list-endpoints/use-fetch-list-items";
import { IssueSearchEndpoint } from "../../list-endpoints/issue-search-endpoint";

const search = {
  filters: [
    {
      key: "state",
      value: "open",
      negated: false,
    },
  ],
  searchTerms: ["react"],
  finalItem: "react",
  serverFilters: [
    {
      filter: {
        key: "state",
        suggestions: ["open", "closed"],
      },
      negated: false,
      value: "open",
    },
  ],
  clientFilters: [],
  suggestions: [],
  search: "state:open react",
};

export const AppLayout: FC = () => {
  const { list, fetchNextPage, isFetching, hasNextPage } = useFetchListItems(new IssueSearchEndpoint(), search);
  console.log("!!", list, isFetching, hasNextPage);
  return (
    <>
      <button onClick={() => fetchNextPage()}>Test</button>
      hello
      <Outlet />
    </>
  );
};
