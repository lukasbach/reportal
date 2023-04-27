import { SearchQueryDefinition } from "../common/filter-lists/types";
import { constructGithubSearch, ParsedSearchResult } from "../common/filter-lists/search-utils";
import { ListEndpointDefinition } from "../common/filter-lists/list-endpoint-definition";
import { EndpointId } from "./endpoints";
import { ReposSearchEndpoint } from "./repos-search-endpoint";

const starredReposQuery = `
query starredRepos($first:Int!, $after:String) {
  viewer {
    starredRepositories(
      first: $first
      after: $after
      orderBy: {field: STARRED_AT, direction: DESC}
    ) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
      nodes {
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
  }
}
`;

export class StarredReposEndpointEndpoint extends ListEndpointDefinition {
  override readonly id = EndpointId.StarredRepos;

  override readonly name = "Starred Repositories";

  override readonly defaultData = {
    endpointId: EndpointId.StarredRepos,
    search: "",
    name: "My Starred Repositories",
    pinned: false,
    fields: ["name", "description", "stargazerCount"],
    fieldWidths: {},
  };

  override orderByOptions = undefined;

  override readonly responseFields = new ReposSearchEndpoint().responseFields;

  override readonly serverFilters = [];

  override getSelectedOrderBy = undefined;

  override getSearchQueries(props): SearchQueryDefinition {
    const { octokit, filters, searchStrings, pageSize } = props;
    return async ({ pageParam }) => {
      const result = await octokit.graphql(starredReposQuery.toString(), {
        search: constructGithubSearch(searchStrings, filters),
        first: pageSize,
        after: pageParam,
      });
      return {
        result: result.viewer.starredRepositories.nodes,
        resultCount: result.viewer.starredRepositories.totalCount,
        ...result.viewer.starredRepositories.pageInfo,
      };
    };
  }

  override clickAction(item) {
    window.open(item.url, "_blank");
  }
}
