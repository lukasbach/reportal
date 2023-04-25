import { SearchQueryDefinition } from "../common/filter-lists/types";
import { constructGithubSearch, ParsedSearchResult } from "../common/filter-lists/search-utils";
import { cellRenderers } from "../common/filter-lists/cell-renderers";
import { repositoryResponseFields } from "../common/filter-lists/common-response-fields";
import { ListEndpointDefinition } from "../common/filter-lists/list-endpoint-definition";
import { EndpointId } from "./endpoints";
import { useDetailsStore } from "../components/details/use-details-store";

const issueSearchQuery = `
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
  number: number;
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

  override orderByOptions = [
    { key: "sort", value: "comments", name: "Comment Count" },
    { key: "sort", value: "created", name: "Created Date" },
    { key: "sort", value: "updated", name: "Updated Date" },
    { key: "sort", value: "reactions-+1", name: "Reactions +1" },
    { key: "sort", value: "reactions--1", name: "Reactions -1" },
    { key: "sort", value: "reactions-smile", name: "Reactions Smile" },
    { key: "sort", value: "reactions-thinking_face", name: "Reactions Thinking Face" },
    { key: "sort", value: "reactions-heart", name: "Reactions Heart" },
    { key: "sort", value: "reactions-tada", name: "Reactions Tada" },
    { key: "sort", value: "interactions", name: "Interactions" },
    { key: "sort", value: "best-match", name: "Best Match" },
  ];

  override readonly responseFields = [
    { key: "number", name: "Number" },
    { key: "closed", name: "Closed" },
    { key: "author.login", name: "Author", renderCell: cellRenderers.author("author", "login", "avatarUrl") },
    { key: "title", name: "Title", renderCell: cellRenderers.issueTitle() },
    ...repositoryResponseFields,
    { key: "closedAt", name: "Closed Date", renderCell: cellRenderers.date() },
    { key: "comments.totalCount", name: "Comments Count" },
    { key: "createdAt", name: "Created Date", renderCell: cellRenderers.date() },
    { key: "state", name: "State", renderCell: cellRenderers.issueState() },
    { key: "stateReason", name: "State Reason" },
    { key: "updatedAt", name: "Updated Date", renderCell: cellRenderers.date() },
    { key: "url", name: "URL" },
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
    ...this.getOrderByFilterKeys(this.orderByOptions),
  ];

  override getSelectedOrderBy = (search: ParsedSearchResult) =>
    this.orderByOptions.find((option) => search.filters.find((f) => f.key === "sort")?.value === option.value);

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

  override clickAction(item: IssueData) {
    const isPr = item.url.includes("/pull/"); // TODO
    useDetailsStore.getState().openIssue(item.repository.owner.login, item.repository.name, item.number, isPr);
  }
}
