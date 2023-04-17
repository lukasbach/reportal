import React, { useMemo } from "react";
import { Octokit } from "@octokit/rest";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement } from "chart.js";
import { Checkbox, FormControl, useTheme } from "@primer/react";
import { GraphIcon } from "@primer/octicons-react";
import { AbstractWidgetDefinition } from "../common/widgets/abstract-widget-definition";
import { WidgetConfigComponent, WidgetDisplayComponent } from "../common/widgets/types";
import { RepoInput } from "../components/common/repo-input";
import { useAuthStore } from "../auth";
import { ConfigureWidgetEmptyState } from "../components/common/empty-states/configure-widget-empty-state";
import { LoadingEmptyState } from "../components/common/empty-states/loading-empty-state";
import { IssueHistoryQueryQuery } from "../gql/graphql";
import { isNotNullish } from "../utils";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(LineController);
Chart.register(LineElement);
Chart.register(PointElement);

type OpenIssuesGraphWidgetConfig = {
  repo: string;
};

const query = /* GraphQL */ `
  query issueHistoryQuery($owner: String!, $repo: String!, $first: Int!, $cursor: String) {
    repository(name: $repo, owner: $owner) {
      allowUpdateBranch
      issues(after: $cursor, first: $first) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          closedAt
          createdAt
        }
      }
      createdAt
    }
  }
`;

interface Item {
  createdAt: string;
  closedAt?: string;
}

const ConfigComponent: WidgetConfigComponent<OpenIssuesGraphWidgetConfig> = ({ config, onChange }) => {
  return <RepoInput value={config.repo} onChange={(value) => onChange({ ...config, repo: value })} />;
};

const DisplayComponent: WidgetDisplayComponent<OpenIssuesGraphWidgetConfig> = ({ config, onEdit }) => {
  const { theme } = useTheme();
  const { kit } = useAuthStore();
  const { data } = useQuery(
    ["stargazers", config.repo],
    () =>
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      OpenIssuesGraphWidget.fetchIssues(config.repo, kit),
    { refetchOnWindowFocus: false }
  );
  const graphData = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    () => (data?.issues ? OpenIssuesGraphWidget.transformIssueData(data.issues, 50, data.createdAt ?? "") : undefined),
    [data]
  );

  if (config.repo === "" || config.repo === "/") {
    return <ConfigureWidgetEmptyState onEdit={onEdit} />;
  }

  if (!graphData) {
    return <LoadingEmptyState />;
  }

  return (
    <Line
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { display: false } },
        },
        elements: { point: { radius: 0 } },
      }}
      data={{
        labels: graphData.bucketDates,
        datasets: [{ label: "", data: graphData.buckets, borderColor: theme?.colors.accent.emphasis }],
      }}
    />
  );
};

export class OpenIssuesGraphWidget extends AbstractWidgetDefinition<OpenIssuesGraphWidgetConfig> {
  override id = "openIssuesGraph";

  override name = "Open Issue Count Graph";

  override displayComponent = DisplayComponent;

  override configComponent = ConfigComponent;

  override iconComponent = () => <GraphIcon size={16} />;

  override generalIconComponent = () => <GraphIcon size={16} />;

  override async generateDefaultConfig(): Promise<OpenIssuesGraphWidgetConfig> {
    return {
      repo: "octocat/Hello-World",
    };
  }

  readonly defaultSize = [5, 2] as const;

  static async fetchIssues(repoString: string, octokit: Octokit) {
    const [owner, repo] = repoString.split("/", 2);
    const issues: Item[] = [];
    let cursor: string | undefined;
    let createdAt: string | undefined;
    do {
      const response: IssueHistoryQueryQuery = await octokit.graphql(query, {
        owner,
        repo,
        cursor,
        first: 100,
      });
      createdAt = response.repository?.createdAt;
      cursor = response.repository?.issues.pageInfo.hasNextPage
        ? response.repository?.issues.pageInfo.endCursor ?? undefined
        : undefined;
      issues.push(...(response.repository?.issues.nodes?.filter(isNotNullish) ?? []));
    } while (cursor);
    return { issues, createdAt };
  }

  static transformIssueData(items: Item[], bucketCount: number, startDate: string) {
    const buckets: number[] = new Array(bucketCount).fill(0);
    const bucketDates: string[] = new Array(bucketCount).fill("");

    const minDate = new Date(startDate);
    const maxDate = new Date();
    const bucketSize = (maxDate.getTime() - minDate.getTime()) / bucketCount;

    for (const { createdAt, closedAt } of items) {
      const dateObj = new Date(createdAt);
      // add to all buckets where the issue is open
      for (let i = 0; i < bucketCount; i++) {
        const wasCreatedBeforeBucket = dateObj.getTime() < minDate.getTime() + i * bucketSize;
        const wasClosedAfterBucket = closedAt && new Date(closedAt).getTime() > minDate.getTime() + i * bucketSize;
        if (wasCreatedBeforeBucket && (wasClosedAfterBucket || !closedAt)) {
          buckets[i]++;
        }
      }
    }

    for (let i = 0; i < bucketCount; i++) {
      const date = new Date(minDate.getTime() + i * bucketSize);
      bucketDates[i] = date.toLocaleDateString();
    }

    return { buckets, bucketDates };
  }
}
