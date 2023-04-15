import React, { useMemo } from "react";
import { Octokit } from "@octokit/rest";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement } from "chart.js";
import { AbstractWidgetDefinition } from "./abstract-widget-definition";
import { WidgetConfigComponent, WidgetDisplayComponent } from "./types";
import { RepoInput } from "../components/common/repo-input";
import { useAuthStore } from "../auth";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(LineController);
Chart.register(LineElement);
Chart.register(PointElement);

type StargazerGraphWidgetConfig = {
  repo: string;
};

type Response = {
  repository: {
    stargazers: {
      edges: {
        starredAt: string;
      }[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
  };
};

const ConfigComponent: WidgetConfigComponent<StargazerGraphWidgetConfig> = ({ config, onChange }) => {
  return <RepoInput value={config.repo} onChange={(value) => onChange({ repo: value })} />;
};

const DisplayComponent: WidgetDisplayComponent<StargazerGraphWidgetConfig> = ({ config }) => {
  const { kit } = useAuthStore();
  const { data } = useQuery(
    ["stargazers", config.repo],
    () =>
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      StargazerGraphWidget.fetchStargazers(config.repo, kit),
    { refetchOnWindowFocus: false }
  );
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const graphData = useMemo(() => (data ? StargazerGraphWidget.transformStargazers(data, 50) : undefined), [data]);

  if (!graphData) {
    return null;
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
        datasets: [{ label: "", data: graphData.buckets }],
      }}
    />
  );
};

export class StargazerGraphWidget extends AbstractWidgetDefinition<StargazerGraphWidgetConfig> {
  override id = "stargazerGraph";

  override name = "Stargazer Graph";

  override displayComponent = DisplayComponent;

  override configComponent = ConfigComponent;

  override async generateDefaultConfig(): Promise<StargazerGraphWidgetConfig> {
    return {
      repo: "octocat/Hello-World",
    };
  }

  readonly defaultSize = [5, 2] as const;

  private static query = `query repoDataQuery($owner: String!, $repo: String!, $cursor: String) {
    repository(name: $repo, owner: $owner) {
      stargazers(first: 100, after: $cursor) {
        edges {
          starredAt
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }`;

  static async fetchStargazers(repoString: string, octokit: Octokit) {
    const [owner, repo] = repoString.split("/", 2);
    const gazers: string[] = [];
    let cursor: string | undefined;
    do {
      const response: Response = await octokit.graphql(StargazerGraphWidget.query, {
        owner,
        repo,
        cursor,
      });
      cursor = response.repository.stargazers.pageInfo.hasNextPage
        ? response.repository.stargazers.pageInfo.endCursor
        : undefined;
      gazers.push(...response.repository.stargazers.edges.map((edge) => edge.starredAt));
    } while (cursor);
    return gazers;
  }

  static transformStargazers(dates: string[], bucketCount: number) {
    const buckets: number[] = new Array(bucketCount).fill(0);
    const bucketDates: string[] = new Array(bucketCount).fill("");

    const minDate = new Date(Math.min(...dates.map((date) => new Date(date).getTime())));
    const maxDate = new Date(Math.max(...dates.map((date) => new Date(date).getTime())));
    const bucketSize = (maxDate.getTime() - minDate.getTime()) / bucketCount;

    for (const date of dates) {
      const dateObj = new Date(date);
      const bucketIndex = Math.floor((dateObj.getTime() - minDate.getTime()) / bucketSize);
      buckets[bucketIndex]++;
    }

    for (let i = 0; i < bucketCount; i++) {
      const date = new Date(minDate.getTime() + i * bucketSize);
      bucketDates[i] = date.toLocaleDateString();
    }

    const aggregatedBuckets = buckets.reduce((acc, val, i) => {
      return [...acc, val + (acc[i - 1] ?? 0)];
    }, [] as number[]);

    return { buckets: aggregatedBuckets, bucketDates };
  }
}
