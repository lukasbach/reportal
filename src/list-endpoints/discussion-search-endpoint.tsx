import { SearchQueryDefinition } from "../common/filter-lists/types";
import { constructGithubSearch, ParsedSearchResult } from "../common/filter-lists/search-utils";
import { ListEndpointDefinition } from "../common/filter-lists/list-endpoint-definition";
import { EndpointId } from "./endpoints";

const discussionSearchQuery = `
query discussionSearchQuery($search: String!, $first: Int!, $after: String) {
  search(type: DISCUSSION, query: $search, first: $first, after: $after) {
    nodes {
      ... on Discussion {
        activeLockReason
        answerChosenAt
        answerChosenBy {
          avatarUrl(size: 32)
          login
        }
        answer {
          author {
            avatarUrl(size: 32)
            login
          }
        }
        author {
          avatarUrl(size: 32)
          login
        }
        authorAssociation
        category {
          emoji
          emojiHTML
          isAnswerable
          name
          slug
        }
        closed
        closedAt
        comments {
          totalCount
        }
        createdAt
        lastEditedAt
        locked
        number
        publishedAt
        title
        updatedAt
        upvoteCount
        url
        stateReason
        repository {
          name
          nameWithOwner
          owner {
            avatarUrl(size: 32)
            login
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    discussionCount
  }
}
`;

export class DiscussionSearchEndpoint extends ListEndpointDefinition {
  override readonly id = EndpointId.Discussions;

  override readonly name = "Discussions";

  override readonly defaultData = {
    endpointId: EndpointId.Discussions,
    search: "involves:@me",
    name: "My Discussions List",
    pinned: false,
    fields: ["title", "author.login", "comments.totalCount", "updatedAt", "repository.nameWithOwner"],
    fieldWidths: {},
  };

  override orderByOptions = [
    // TODO maybe? no documentation found..
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
    this.f("activeLockReason", "Lock Reason").text().f,
    this.f("answerChosenAt", "Answer Chosen At").date().f,
    this.f("answerChosenBy", "Answer Chosen By").user().f,
    this.f("answer.author", "Answer Author").user().f,
    this.f("author", "Author").user().f,
    this.f("authorAssociation", "Author Association").text().f,
    this.f("category.emojiHTML", "Category Emoji").emoji().f,
    this.f("category.isAnswerable", "Category Is Answerable").boolean().f,
    this.f("category.name", "Category Name").text().f,
    this.f("category.slug", "Category Slug").text().f,
    this.f("closed", "Closed").boolean().f,
    this.f("closedAt", "Closed At").date().f,
    this.f("comments.totalCount", "Comment Count").number().f,
    this.f("createdAt", "Created At").date().f,
    this.f("lastEditedAt", "Last Edited At").date().f,
    this.f("locked", "Locked").boolean().f,
    this.f("number", "Number").number().f,
    this.f("publishedAt", "Published At").date().f,
    this.f("title", "Title").text().f,
    this.f("updatedAt", "Updated At").date().f,
    this.f("upvoteCount", "Upvote Count").number().f,
    this.f("url", "URL").url().f,
    this.f("stateReason", "State Reason").text().f,
    this.f("repository.name", "Repository Name").repoName("repository.owner.avatarUrl").f,
    this.f("repository.nameWithOwner", "Repository Name With Owner").repoName("repository.owner.avatarUrl").f,
    this.f("repository.owner", "Repository Owner").user().f,
  ];

  override readonly serverFilters = [
    this.f("in", "Search in fields").enum("title", "body", "comments").f,
    this.f("user", "Repo owner name").text().f,
    this.f("org", "Organization name").text().f,
    this.f("repo", "Repo name").repoName().f,
    this.f("is", "Is...").enum("public", "private").f,
    this.f("author", "Author name").text().f,
    this.f("commenter", "Commenter name").text().f,
    this.f("answered-by", "Answered by user name").text().f,
    this.f("involves", "Involves user name").text().f,
    this.f("comments", "Comment count range").text().f,
    this.f("created", "Created Date").date().f,
    this.f("updated", "Updated Date").date().f,

    ...this.getOrderByFilterKeys(this.orderByOptions),
  ];

  override getSelectedOrderBy = (search: ParsedSearchResult) =>
    this.orderByOptions.find((option) => search.filters.find((f) => f.key === "sort")?.value === option.value);

  override getSearchQueries(props): SearchQueryDefinition {
    const { octokit, filters, searchStrings, pageSize } = props;
    return async ({ pageParam }) => {
      const result = await octokit.graphql(discussionSearchQuery.toString(), {
        search: constructGithubSearch(searchStrings, filters),
        first: pageSize,
        after: pageParam,
      });
      return {
        result: result.search.nodes,
        resultCount: result.search.discussionCount,
        ...result.search.pageInfo,
      };
    };
  }

  override clickAction(item) {
    window.open(item.url, "_blank");
  }

  override getUrlTarget(item) {
    return item.url;
  }
}
