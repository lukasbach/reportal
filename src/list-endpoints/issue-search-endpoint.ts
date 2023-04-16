import { SearchQueryDefinition } from "../common/filter-lists/types";
import { constructGithubSearch } from "../common/filter-lists/search-utils";
import { cellRenderers } from "../common/filter-lists/cell-renderers";
import { repositoryResponseFields } from "../common/filter-lists/common-response-fields";
import { ListEndpointDefinition } from "../common/filter-lists/list-endpoint-definition";
import { EndpointId } from "./endpoints";

const issueSearchQuery = /* GraphQL */ `
  query issueSearchQuery($search: String!, $first: Int!, $after: String) {
    search(type: ISSUE, query: $search, first: $first, after: $after) {
      nodes {
        ... on Issue {
          number
          closed
          author {
            login
            avatarUrl(size: 32)
          }
          title
          repository {
            nameWithOwner
            description
            createdAt
            id
            homepageUrl
            name
            owner {
              avatarUrl(size: 32)
              login
            }
            stargazerCount
          }
          closedAt
          comments {
            totalCount
          }
          createdAt
          id
          labels(first: 100) {
            nodes {
              color
              createdAt
              id
              description
              name
            }
            totalCount
          }
          state
          stateReason
          updatedAt
          url
        }
        ... on PullRequest {
          number
          closed
          author {
            login
            avatarUrl(size: 32)
          }
          title
          repository {
            nameWithOwner
            description
            createdAt
            id
            homepageUrl
            name
            owner {
              avatarUrl(size: 32)
              login
            }
            stargazerCount
          }
          closedAt
          comments {
            totalCount
          }
          createdAt
          id
          labels(first: 100) {
            nodes {
              color
              createdAt
              id
              description
              name
            }
            totalCount
          }
          state
          updatedAt
          url
          isCrossRepository
          merged
          mergedAt
          mergedBy {
            avatarUrl(size: 32)
            login
          }
          totalCommentsCount
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      issueCount
    }
  }
`;
export type IssueData = {
  author: {
    login: string;
    avatarUrl: string;
  };
  body: string;
  comments: {
    totalCount: number;
  };
  createdAt: string;
  editor: {
    login: string;
    avatarUrl: string;
  };
  id: string;
  labels: {
    nodes: {
      color: string;
      id: string;
      name: string;
    }[];
    totalCount: number;
  };
  repository: {
    name: string;
    nameWithOwner: string;
    owner: { login: string; avatarUrl: string };
    stargazerCount: string;
    url: string;
  };
  state: string;
  stateReason: string;
  title: string;
  updatedAt: string;
  url: string;
};

export class IssueSearchEndpoint extends ListEndpointDefinition<IssueData> {
  override readonly id = EndpointId.Issues;

  override readonly name = "Issues and Pull Requests";

  override readonly defaultData = {
    endpointId: "issues",
    search: "type:issue assignee:@me state:open",
    name: "My Issue List",
    pinned: false,
    fields: ["number", "title", "author.login", "repository.nameWithOwner", "state"],
    fieldWidths: {},
  };

  override readonly responseFields = [
    { jsonKey: "number", name: "Number" },
    { jsonKey: "closed", name: "Closed" },
    { jsonKey: "author.login", name: "Author", renderCell: cellRenderers.author("author", "avatarUrl") },
    { jsonKey: "title", name: "Title", renderCell: cellRenderers.issueTitle() },
    ...repositoryResponseFields,
    { jsonKey: "closedAt", name: "Closed Date", renderCell: cellRenderers.date() },
    { jsonKey: "comments.totalCount", name: "Comments Count" },
    { jsonKey: "createdAt", name: "Created Date", renderCell: cellRenderers.date() },
    { jsonKey: "state", name: "State", renderCell: cellRenderers.issueState() },
    { jsonKey: "stateReason", name: "State Reason" },
    { jsonKey: "updatedAt", name: "Updated Date", renderCell: cellRenderers.date() },
    { jsonKey: "url", name: "URL" },
  ];

  override readonly serverFilters = [
    { key: "type", suggestions: ["issue", "pr"] },
    { key: "in", suggestions: ["title", "body", "comments"], multiple: true },
    { key: "user" },
    { key: "assignee" },
    { key: "author" }, // TODO ?
    { key: "org" },
    { key: "repo" },
    { key: "state", suggestions: ["open", "closed"] },
    { key: "is", suggestions: ["open", "closed", "queued", "public", "private"], multiple: true },
    { key: "reason", suggestions: ["completed", "not planned"] },
  ];

  override getSearchQueries(props): SearchQueryDefinition {
    const { octokit, filters, searchStrings, pageSize } = props;
    return async ({ pageParam }) => {
      const result = await octokit.graphql(issueSearchQuery.toString(), {
        search: constructGithubSearch(searchStrings, filters),
        first: pageSize,
        after: pageParam,
      });
      return {
        result: result.search.nodes,
        resultCount: result.search.issueCount,
        ...result.search.pageInfo,
      };
    };
  }
}
