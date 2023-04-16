import { useQuery } from "@tanstack/react-query";
import { constructGithubSearch } from "./filter-lists/search-utils";
import { useAuthStore } from "../auth";

const query = `
  query repoDataQuery($owner:String!, $repo:String!) {
    repository(name: $repo, owner: $owner) {
      createdAt
      forkCount
      discussions {
        totalCount
      }
      openIssues: issues(states: OPEN) {
        totalCount
      }
      closedIssues: issues(states: CLOSED) {
        totalCount
      }
      openPullRequests: pullRequests(states: OPEN) {
        totalCount
      }
      closedPullRequests: pullRequests(states: CLOSED) {
        totalCount
      }
      releases {
        totalCount
      }
      stargazerCount
      updatedAt
      latestRelease {
        createdAt
        name
        publishedAt
      }
    }
  }
`;

type Result = {
  createdAt: string;
  forkCount: number;
  discussions: { totalCount: number };
  openIssues: { totalCount: number };
  closedIssues: { totalCount: number };
  openPullRequests: { totalCount: number };
  closedPullRequests: { totalCount: number };
  releases: { totalCount: number };
  stargazerCount: number;
  updatedAt: string;
  latestRelease: {
    createdAt: string;
    name: string;
    publishedAt: string;
  };
};

export const useRepoData = (owner: string, repo: string): Result | undefined => {
  const { kit } = useAuthStore();

  const result = useQuery({
    queryKey: ["repo-data", owner, repo],
    queryFn: () => {
      return kit.graphql(query, {
        owner,
        repo,
      });
    },
    refetchOnWindowFocus: true,
  });

  return (result.data as any)?.repository as Result;
};
