import { SearchQueryDefinition } from "../common/filter-lists/types";
import { constructGithubSearch, ParsedSearchResult } from "../common/filter-lists/search-utils";
import { ListEndpointDefinition } from "../common/filter-lists/list-endpoint-definition";
import { EndpointId } from "./endpoints";
import React from "react";
import { CellContentWithIcon } from "../components/common/cell-content-with-icon";
import { Avatar } from "@primer/react";

const repoSearchQuery = `
query repoSearchQuery($search: String!, $first: Int!, $after: String) {
  search(type: REPOSITORY, query: $search, first: $first, after: $after) {
    nodes {
      ... on Repository {
        id
        name
        createdAt
        description
        diskUsage
        forkCount
        isArchived
        isDisabled
        isEmpty
        isFork
        isInOrganization
        isLocked
        isMirror
        isPrivate
        isTemplate
        totalIssues: issues {
          totalCount
        }
        openIssues: issues(states: OPEN) {
          totalCount
        }
        closedIssues: issues(states: CLOSED) {
          totalCount
        }
        latestRelease {
          createdAt
          author {
            avatarUrl(size: 32)
            login
          }
          name
          publishedAt
          url
          updatedAt
          tagName
        }
        nameWithOwner
        owner {
          avatarUrl(size: 32)
          login
        }
        totalPullRequests: pullRequests {
          totalCount
        }
        openPullRequests: pullRequests(states: OPEN) {
          totalCount
        }
        closedPullRequests: pullRequests(states: CLOSED) {
          totalCount
        }
        mergedPullRequests: pullRequests(states: MERGED) {
          totalCount
        }
        stargazerCount
        pushedAt
        sshUrl
        updatedAt
        url
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    repositoryCount
  }
}
`;

export class ReposSearchEndpoint extends ListEndpointDefinition {
  override readonly id = EndpointId.Repos;

  override readonly name = "Repositories";

  override readonly defaultData = {
    endpointId: EndpointId.Repos,
    search: "user:@me",
    name: "My Repo List",
    pinned: false,
    fields: ["name", "diskUsage", "stargazerCount", "openIssues.totalCount", "openPullRequests.totalCount"],
    fieldWidths: {},
  };

  override orderByOptions = [
    { key: "sort", value: "stars", name: "Star Count" },
    { key: "sort", value: "forks", name: "Fork Count" },
    { key: "sort", value: "help-wanted-issues", name: "Number of Help Wanted Issues" },
    { key: "sort", value: "updated", name: "Last Updated" },
    { key: "sort", value: "best-match", name: "Best Match" },
  ];

  override readonly responseFields = [
    this.responseField.custom("Name", "name", (value, data) => (
      <CellContentWithIcon text={value}>
        <Avatar src={data.owner.avatarUrl} size={16} alt={data.owner.login} />
      </CellContentWithIcon>
    )),
    this.responseField.custom("Name with Owner", "nameWithOwner", (value, data) => (
      <CellContentWithIcon text={value}>
        <Avatar src={data.owner.avatarUrl} size={16} alt={data.owner.login} />
      </CellContentWithIcon>
    )),
    this.responseField.text("Description", "description"),
    this.responseField.date("Created Date", "createdAt"),
    this.responseField.text("Description", "description"),
    this.responseField.diskUsage("Disk Usage", "diskUsage"),
    this.responseField.number("Fork Count", "forkCount"),
    this.responseField.boolean("Is Archived", "isArchived"),
    this.responseField.boolean("Is Disabled", "isDisabled"),
    this.responseField.boolean("Is Empty", "isEmpty"),
    this.responseField.boolean("Is Fork", "isFork"),
    this.responseField.boolean("Is In Organization", "isInOrganization"),
    this.responseField.boolean("Is Locked", "isLocked"),
    this.responseField.boolean("Is Mirror", "isMirror"),
    this.responseField.boolean("Is Private", "isPrivate"),
    this.responseField.boolean("Is Template", "isTemplate"),
    this.responseField.number("Total Issues", "totalIssues.totalCount"),
    this.responseField.number("Open Issues", "openIssues.totalCount"),
    this.responseField.number("Closed Issues", "closedIssues.totalCount"),
    this.responseField.date("Latest Release Created Date", "latestRelease.createdAt"),
    this.responseField.user("Latest Release Author", "latestRelease.author"),
    this.responseField.text("Latest Release Name", "latestRelease.name"),
    this.responseField.date("Latest Release Published Date", "latestRelease.publishedAt"),
    this.responseField.url("Latest Release URL", "latestRelease.url"),
    this.responseField.date("Latest Release Updated Date", "latestRelease.updatedAt"),
    this.responseField.text("Latest Release Tag Name", "latestRelease.tagName"),
    this.responseField.user("Owner", "owner"),
    this.responseField.number("Total Pull Requests", "totalPullRequests.totalCount"),
    this.responseField.number("Open Pull Requests", "openPullRequests.totalCount"),
    this.responseField.number("Closed Pull Requests", "closedPullRequests.totalCount"),
    this.responseField.number("Merged Pull Requests", "mergedPullRequests.totalCount"),
    this.responseField.number("Star Count", "stargazerCount"),
    this.responseField.date("Last Pushed Date", "pushedAt"),
    this.responseField.text("SSH URL", "sshUrl"),
    this.responseField.date("Last Updated Date", "updatedAt"),
    this.responseField.url("URL", "url"),
  ];

  override readonly serverFilters = [
    this.serverFilter.enum("in", "Search in fields", ["name", "description", "topics", "readme"]),
    this.serverFilter.text("user", "Owner name"),
    this.serverFilter.text("org", "Organization name"),
    this.serverFilter.text("size", "Disk size range"),
    this.serverFilter.text("followers", "Follower count range"),
    this.serverFilter.text("stars", "Star count range"),
    this.serverFilter.text("forks", "Fork count range"),
    this.serverFilter.date("created", "Created Date"),
    this.serverFilter.date("pushed", "Last Push Date"),
    this.serverFilter.text("language", "Language"),
    this.serverFilter.text("topic", "Topic"),
    this.serverFilter.text("license", "License"),
    this.serverFilter.enum("is", "Is...", ["public", "internal", "private"]),
    this.serverFilter.boolean("template", "Is Template Repo"),
    this.serverFilter.boolean("archived", "Is Archived"),

    ...this.getOrderByFilterKeys(this.orderByOptions),
  ];

  override getSelectedOrderBy = (search: ParsedSearchResult) =>
    this.orderByOptions.find((option) => search.filters.find((f) => f.key === "sort")?.value === option.value);

  override getSearchQueries(props): SearchQueryDefinition {
    const { octokit, filters, searchStrings, pageSize } = props;
    return async ({ pageParam }) => {
      const result = await octokit.graphql(repoSearchQuery.toString(), {
        search: constructGithubSearch(searchStrings, filters),
        first: pageSize,
        after: pageParam,
      });
      return {
        result: result.search.nodes,
        resultCount: result.search.repositoryCount,
        ...result.search.pageInfo,
      };
    };
  }

  override clickAction() {}
}
