import React from "react";
import { Avatar } from "@primer/react";
import { SearchQueryDefinition } from "../common/filter-lists/types";
import { constructGithubSearch, ParsedSearchResult } from "../common/filter-lists/search-utils";
import { ListEndpointDefinition } from "../common/filter-lists/list-endpoint-definition";
import { EndpointId } from "./endpoints";
import { CellContentWithIcon } from "../components/common/cell-content-with-icon";

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
    this.responseField.boolean("Lock Reason", "activeLockReason"),
    this.responseField.date("Answer Chosen At", "answerChosenAt"),
    this.responseField.user("Answer Chosen By", "answerChosenBy"),
    this.responseField.user("Answer Author", "answer.author"),
    this.responseField.user("Author", "author"),
    this.responseField.text("Author Association", "authorAssociation"),
    this.responseField.text("Category Emoji", "category.emoji"),
    this.responseField.text("Category Emoji HTML", "category.emojiHTML"),
    this.responseField.boolean("Category Is Answerable", "category.isAnswerable"),
    this.responseField.text("Category Name", "category.name"),
    this.responseField.text("Category Slug", "category.slug"),
    this.responseField.boolean("Closed", "closed"),
    this.responseField.date("Closed At", "closedAt"),
    this.responseField.number("Comment Count", "comments.totalCount"),
    this.responseField.date("Created At", "createdAt"),
    this.responseField.date("Last Edited At", "lastEditedAt"),
    this.responseField.boolean("Locked", "locked"),
    this.responseField.number("Number", "number"),
    this.responseField.date("Published At", "publishedAt"),
    this.responseField.text("Title", "title"),
    this.responseField.date("Updated At", "updatedAt"),
    this.responseField.number("Upvote Count", "upvoteCount"),
    this.responseField.url("URL", "url"),
    this.responseField.text("State Reason", "stateReason"),
    this.responseField.text("Repository Name", "repository.name"),
    this.responseField.text("Repository Name With Owner", "repository.nameWithOwner"),
    this.responseField.user("Repository Owner", "repository.owner"),
  ];

  override readonly serverFilters = [
    this.serverFilter.enum("in", "Search in fields", ["title", "body", "comments"]),
    this.serverFilter.text("user", "Repo owner name"),
    this.serverFilter.text("org", "Organization name"),
    this.serverFilter.text("repo", "Repo name"),
    this.serverFilter.enum("is", "Is...", ["public", "private"]),
    this.serverFilter.text("author", "Author name"),
    this.serverFilter.text("commenter", "Commenter name"),
    this.serverFilter.text("answered-by", "Answered by user name"),
    this.serverFilter.text("involves", "Involves user name"),
    this.serverFilter.text("comments", "Comment count range"),
    this.serverFilter.date("created", "Created Date"),
    this.serverFilter.date("updated", "Updated Date"),

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

  override clickAction() {}
}
