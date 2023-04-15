import React from "react";
import { Box, Button } from "@primer/react";
import { AbstractWidgetDefinition } from "./abstract-widget-definition";
import { WidgetConfigComponent, WidgetDisplayComponent } from "./types";
import { ValueBoardConfigItem } from "../components/value-board/value-board-config-item";
import { EmbeddedFilterListPayload } from "../components/filter-list/types";
import { ValueBoardDisplayItem } from "../components/value-board/value-board-display-item";

export type ValueBoardItem =
  | { type: "unset"; name: string }
  | {
      type: "filterListTotal";
      name: string;
      filterList: EmbeddedFilterListPayload;
    }
  | {
      type: "repoStat";
      name: string;
      repo: string;
      statKey: string;
      renderAs?: "date" | "string";
    };

export const valueBoardItemTypes: Record<string, { name: string; initial: ValueBoardItem }> = {
  filterListTotal: {
    name: "Filter List Total",
    initial: { type: "filterListTotal", name: "Filter List Count", filterList: { type: "unset" } },
  },

  createdAt: {
    name: "Created Date",
    initial: {
      type: "repoStat",
      statKey: "createdAt",
      name: "Created At",
      repo: "octocat/hello-world",
      renderAs: "date",
    },
  },
  updatedAt: {
    name: "Last Update Date",
    initial: {
      type: "repoStat",
      statKey: "updatedAt",
      name: "Updated At",
      repo: "octocat/hello-world",
      renderAs: "date",
    },
  },
  releaseCreatedAt: {
    name: "Latest Release Creation Date",
    initial: {
      type: "repoStat",
      statKey: "latestRelease.createdAt",
      name: "Latest Release",
      repo: "octocat/hello-world",
      renderAs: "date",
    },
  },
  releasePublishedAt: {
    name: "Latest Release Publish Date",
    initial: {
      type: "repoStat",
      statKey: "latestRelease.publishedAt",
      name: "Latest Release Published",
      repo: "octocat/hello-world",
      renderAs: "date",
    },
  },

  forkCount: {
    name: "Fork Count",
    initial: {
      type: "repoStat",
      statKey: "forkCount",
      name: "Forks",
      repo: "octocat/hello-world",
    },
  },

  openIssuesCount: {
    name: "Open Issues Count",
    initial: {
      type: "repoStat",
      statKey: "openIssues.totalCount",
      name: "Open Issues",
      repo: "octocat/hello-world",
    },
  },

  closedIssuesCount: {
    name: "Closed Issues Count",
    initial: {
      type: "repoStat",
      statKey: "closedIssues.totalCount",
      name: "Closed Issues",
      repo: "octocat/hello-world",
    },
  },

  openPullRequestsCount: {
    name: "Open Pull Requests Count",
    initial: {
      type: "repoStat",
      statKey: "openPullRequests.totalCount",
      name: "Open Pull Requests",
      repo: "octocat/hello-world",
    },
  },

  closedPullRequestsCount: {
    name: "Closed Pull Requests Count",
    initial: {
      type: "repoStat",
      statKey: "closedPullRequests.totalCount",
      name: "Closed Pull Requests",
      repo: "octocat/hello-world",
    },
  },

  stargazerCount: {
    name: "Stargazer Count",
    initial: {
      type: "repoStat",
      statKey: "stargazerCount",
      name: "Stargazers",
      repo: "octocat/hello-world",
    },
  },

  releaseCount: {
    name: "Release Count",
    initial: {
      type: "repoStat",
      statKey: "releases.totalCount",
      name: "Releases",
      repo: "octocat/hello-world",
    },
  },

  latestReleaseName: {
    name: "Latest Release Name",
    initial: {
      type: "repoStat",
      statKey: "latestRelease.name",
      name: "Latest Release",
      repo: "octocat/hello-world",
    },
  },
};

type ValueBoardWidgetConfig = {
  items: ValueBoardItem[];
};

const ConfigComponent: WidgetConfigComponent<ValueBoardWidgetConfig> = ({ config, onChange }) => {
  return (
    <>
      {config.items.map((item, index) => (
        <ValueBoardConfigItem
          config={item}
          onChange={(newConfig) =>
            onChange({
              items: config.items.map((item, i) => (i === index ? newConfig : item)),
            })
          }
          onDelete={() =>
            onChange({
              items: config.items.filter((_, i) => i !== index),
            })
          }
        />
      ))}
      <Button onClick={() => onChange({ items: [...config.items, { type: "unset", name: "Item Name" }] })}>
        Add new Item
      </Button>
    </>
  );
};

const DisplayComponent: WidgetDisplayComponent<ValueBoardWidgetConfig> = ({ config }) => {
  return (
    <Box
      sx={{ display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "flex-start", height: "100%" }}
    >
      {config.items.map((item, index) => (
        <ValueBoardDisplayItem config={item} key={index} />
      ))}
    </Box>
  );
};

export class ValueBoardWidget extends AbstractWidgetDefinition<ValueBoardWidgetConfig> {
  override id = "valueBoard";

  override name = "Value Board";

  override displayComponent = DisplayComponent;

  override configComponent = ConfigComponent;

  override async generateDefaultConfig(): Promise<ValueBoardWidgetConfig> {
    return {
      items: [],
    };
  }

  readonly defaultSize = [4, 1] as const;
}
