import React, { useEffect, useMemo, useState } from "react";
import { GitPullRequestIcon } from "@primer/octicons-react";
import { ActionList, Text } from "@primer/react";
import { useQuery } from "@tanstack/react-query";
import { AbstractWidgetDefinition } from "../common/widgets/abstract-widget-definition";
import { WidgetConfigComponent, WidgetDisplayComponent } from "../common/widgets/types";
import { useGithubAuthStore, useOctokit } from "../auth/hooks";
import { isNotNullish } from "../utils";
import { EmptyState } from "../components/common/empty-states/empty-state";

type CreatePrWidgetConfig = {};

const prDataQuery = `
  query PrDataQuery($repo: String!, $owner: String!, $headRefName: String!) {
  repository(name: $repo, owner: $owner) {
    defaultBranchRef {
      name
    }
    pullRequests(headRefName: $headRefName) {
      totalCount
    }
  }
}
`;

const ConfigComponent: WidgetConfigComponent<CreatePrWidgetConfig> = () => {
  return <Text fontSize={1}>This Widget cannot be configured.</Text>;
};

interface PrOption {
  owner: string;
  repo: string;
  branch: string;
  targetBranch: string;
}

const useRecentPushes = () => {
  const kit = useOctokit();
  const login = useGithubAuthStore((state) => state.login);

  const { data } = useQuery(
    ["create-pr-events"],
    () =>
      kit.request("GET /users/{username}/events", {
        username: login ?? "",
      }),
    { refetchOnWindowFocus: false }
  );
  return useMemo(
    () =>
      data?.data.filter(
        (item) =>
          item.type === "PushEvent" ||
          (item.type === "CreateEvent" && item.payload.ref_type === "branch" && item.payload.pusher_type === "user")
      ),
    [data]
  );
};

const usePrOptions = () => {
  const recentPushes = useRecentPushes();
  const kit = useOctokit();
  const [prOptions, setPrOptions] = useState<PrOption[]>([]);
  useEffect(() => {
    (async () => {
      if (!recentPushes) {
        return;
      }

      // TODO memoize these calls
      const maybePrs: (PrOption | null)[] = await Promise.all(
        recentPushes.map<Promise<PrOption | null>>(async (push) => {
          const [owner, repo] = push.repo.name.split("/");
          const pushRef = (push.payload as any).ref;
          const shortenedPushRef = `${pushRef}`.slice("refs/heads/".length);
          const specificData: any = await kit.graphql(prDataQuery, {
            owner,
            repo,
            headRefName: shortenedPushRef,
          });
          if (
            specificData.repository.pullRequests.totalCount === 0 &&
            pushRef !== `refs/heads/${specificData.repository.defaultBranchRef.name}` &&
            pushRef !== "refs/heads/gh-pages"
          ) {
            return {
              owner,
              repo,
              branch: shortenedPushRef,
              targetBranch: specificData.repository.defaultBranchRef.name,
            };
          }
          return null;
        })
      );

      setPrOptions(
        maybePrs.filter(isNotNullish).filter((pr, i, arr) => arr.findIndex((p) => p.branch === pr.branch) === i)
      );
    })();
  }, [kit, recentPushes]);

  return prOptions;
};

const DisplayComponent: WidgetDisplayComponent<CreatePrWidgetConfig> = () => {
  const prOptions = usePrOptions();

  if (prOptions.length === 0) {
    return <EmptyState text="No Recent Pushes where a PR can be created." />;
  }

  return (
    <ActionList>
      {prOptions.map((pr) => (
        <ActionList.LinkItem
          href={`https://github.com/${pr.owner}/${pr.repo}/compare/${pr.targetBranch}...${pr.branch}`}
          target="_blank"
        >
          {pr.owner}/{pr.repo}
          <ActionList.Description>{pr.branch}</ActionList.Description>
        </ActionList.LinkItem>
      ))}
    </ActionList>
  );
};

export class CreatePrWidget extends AbstractWidgetDefinition<CreatePrWidgetConfig> {
  override id = "createPr";

  override name = "Create PR for recent Push";

  override displayComponent = DisplayComponent;

  override configComponent = ConfigComponent;

  override iconComponent = () => <GitPullRequestIcon size={16} />;

  override generalIconComponent = () => <GitPullRequestIcon size={16} />;

  override async generateDefaultConfig(): Promise<CreatePrWidgetConfig> {
    return {};
  }

  readonly defaultSize = [3, 2] as const;

  readonly minSize = [2, 1] as const;
}
