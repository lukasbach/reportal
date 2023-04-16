import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../auth";
import { IssueOrPullRequest } from "../../gql/graphql";

const prQuery = /* GraphQL */ `
  query PrQuery($repo: String!, $owner: String!, $issue: Int!) {
    repository(name: $repo, owner: $owner) {
      pullRequest(number: $issue) {
        assignees(first: 10) {
          nodes {
            login
            name
            avatarUrl(size: 32)
          }
        }
        author {
          login
          avatarUrl(size: 32)
          ... on User {
            name
          }
        }
        bodyHTML
        closed
        closedAt
        comments(last: 50) {
          totalCount
          nodes {
            id
            author {
              login
              avatarUrl(size: 32)
              ... on User {
                databaseId
                login
              }
            }
            bodyHTML
            createdAt
            isMinimized
            lastEditedAt
            minimizedReason
            publishedAt
            resourcePath
            updatedAt
            viewerCanReact
            reactionGroups {
              content
              createdAt
              viewerHasReacted
              reactors {
                totalCount
              }
            }
          }
        }
        createdAt
        id
        isReadByViewer
        lastEditedAt
        locked
        number
        state
        title
        updatedAt
        url
        isDraft
      }
    }
  }
`;

const issueQuery = /* GraphQL */ `
  query IssueQuery($repo: String!, $owner: String!, $issue: Int!) {
    repository(name: $repo, owner: $owner) {
      issue(number: $issue) {
        assignees(first: 10) {
          nodes {
            login
            name
            avatarUrl(size: 32)
          }
        }
        author {
          login
          avatarUrl(size: 32)
          ... on User {
            name
          }
        }
        bodyHTML
        closed
        closedAt
        comments(last: 50) {
          totalCount
          nodes {
            id
            author {
              login
              avatarUrl(size: 32)
              ... on User {
                databaseId
                login
              }
            }
            bodyHTML
            createdAt
            isMinimized
            lastEditedAt
            minimizedReason
            publishedAt
            resourcePath
            updatedAt
            viewerCanReact
            reactionGroups {
              content
              createdAt
              viewerHasReacted
              reactors {
                totalCount
              }
            }
          }
        }
        createdAt
        id
        isPinned
        isReadByViewer
        lastEditedAt
        locked
        number
        state
        stateReason
        title
        updatedAt
        url
      }
    }
  }
`;

export const useIssueData = (repo: string, owner: string, issue: number, isPr = false) => {
  const { kit } = useAuthStore();
  return useQuery(["issue-data", repo, owner, issue], () =>
    kit.graphql<{ repository: { issue: IssueOrPullRequest } } | { repository: { pullRequest: IssueOrPullRequest } }>(
      isPr ? prQuery : issueQuery,
      {
        repo,
        owner,
        issue,
      }
    )
  );
};
