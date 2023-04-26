import { SearchQueryDefinition } from "../common/filter-lists/types";
import { constructGithubSearch, ParsedSearchResult } from "../common/filter-lists/search-utils";
import { ListEndpointDefinition } from "../common/filter-lists/list-endpoint-definition";
import { EndpointId } from "./endpoints";

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
    this.f("name", "Name").repoName("owner.avatarUrl").f,
    this.f("nameWithOwner", "Name with Owner").repoName("owner.avatarUrl").f,
    this.f("description", "Description").text().f,
    this.f("createdAt", "Created Date").date().f,
    this.f("diskUsage", "Disk Usage").diskUsage().f,
    this.f("forkCount", "Fork Count").number().f,
    this.f("isArchived", "Is Archived").boolean().f,
    this.f("isDisabled", "Is Disabled").boolean().f,
    this.f("isEmpty", "Is Empty").boolean().f,
    this.f("isFork", "Is Fork").boolean().f,
    this.f("isInOrganization", "Is In Organization").boolean().f,
    this.f("isLocked", "Is Locked").boolean().f,
    this.f("isMirror", "Is Mirror").boolean().f,
    this.f("isPrivate", "Is Private").boolean().f,
    this.f("isTemplate", "Is Template").boolean().f,
    this.f("totalIssues.totalCount", "Total Issues").number().f,
    this.f("openIssues.totalCount", "Open Issues").number().f,
    this.f("closedIssues.totalCount", "Closed Issues").number().f,
    this.f("latestRelease.createdAt", "Latest Release Created Date").date().f,
    this.f("latestRelease.author", "Latest Release Author ").user().f,
    this.f("latestRelease.name", "Latest Release Name").text().f,
    this.f("latestRelease.publishedAt", "Latest Release Published Date").date().f,
    this.f("latestRelease.url", "Latest Release URL").url().f,
    this.f("latestRelease.updatedAt", "Latest Release Updated Date").date().f,
    this.f("latestRelease.tagName", "Latest Release Tag Name").text().f,
    this.f("owner", "Owner").user().f,
    this.f("totalPullRequests.totalCount", "Total Pull Requests").number().f,
    this.f("openPullRequests.totalCount", "Open Pull Requests").number().f,
    this.f("closedPullRequests.totalCount", "Closed Pull Requests").number().f,
    this.f("mergedPullRequests.totalCount", "Merged Pull Requests").number().f,
    this.f("stargazerCount", "Stargazer Count").number().f,
    this.f("pushedAt", "Last Pushed at").date().f,
    this.f("sshUrl", "SSH URL").url().f,
    this.f("updatedAt", "Last Updated at").date().f,
    this.f("url", "URL").url().f,
  ];

  override readonly serverFilters = [
    this.f("in", "Search in fields").enum("name", "description", "topics", "readme").f,
    this.f("user", "Owner name").user().f,
    this.f("org", "Organization name").text().f,
    this.f("size", "Disk size range").diskUsage().f,
    this.f("followers", "Follower count range").number().f,
    this.f("stars", "Star count range").number().f,
    this.f("forks", "Fork count range").number().f,
    this.f("created", "Created Date").date().f,
    this.f("pushed", "Last Pushed Date").date().f,
    this.f("language", "Language").text().f,
    this.f("topic", "Topic").text().f,
    this.f("license", "License").text().f,
    this.f("is", "Is...").enum("public", "internal", "private").f,
    this.f("template", "Is Template").boolean().f,
    this.f("archived", "Is Archived").boolean().f,

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

  override clickAction(item) {
    window.open(item.url, "_blank");
  }
}
