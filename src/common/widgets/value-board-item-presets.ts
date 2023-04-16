import { ValueBoardItem } from "../../widgets/value-board-widget";

type Preset = {
  name: string;
  initial: ValueBoardItem;
  presetKey: string;
  type: string;
};

const definePreset = (
  key: string,
  type: string,
  name: string,
  initial: Omit<ValueBoardItem, "type" | "name" | "preset">
): Preset => ({
  presetKey: key,
  type,
  name,
  initial: {
    ...initial,
    type: type as any,
    name,
    preset: key,
  },
});

const defineGhPreset = (key: string, name: string, statKey: string, renderAs?: string) =>
  definePreset(key, "repoStat", name, {
    repo: "octocat/hello-world",
    renderAs,
    statKey,
  });

export const valueBoardPresetsList: Preset[] = [
  definePreset("filterListTotal", "filterListTotal", "Filter List Total", { filterList: { type: "unset" } }),
  defineGhPreset("createdAt", "Created At", "createdAt"),
  defineGhPreset("updatedAt", "Updated At", "updatedAt"),
  defineGhPreset("latestReleaseCreatedAt", "Release Created At", "latestRelease.createdAt"),
  defineGhPreset("latestReleasePublishedAt", "Release Published At", "latestRelease.publishedAt"),
  defineGhPreset("forkCount", "Fork Count", "forkCount"),
  defineGhPreset("openIssues", "Open Issues", "openIssues.totalCount"),
  defineGhPreset("closedIssues", "Closed Issues", "closedIssues.totalCount"),
  defineGhPreset("openPullRequests", "Open Pull Requests", "openPullRequests.totalCount"),
  defineGhPreset("closedPullRequests", "Closed Pull Requests", "closedPullRequests.totalCount"),
  defineGhPreset("releasesCount", "Releases Count", "releases.totalCount"),
  defineGhPreset("starsCount", "Stars", "stargazerCount"),
  defineGhPreset("latestReleaseName", "Latest Release Name", "latestRelease.name"),
  definePreset("npmDownloadCount", "npmDownloadCount", "NPM Package Downloads", {
    filterList: { type: "npmDownloadCount", packageName: "axios", range: "week" },
  }),
];

export const valueBoardPresets = valueBoardPresetsList.reduce((acc, preset) => {
  acc[preset.presetKey] = preset;
  return acc;
}, {} as Record<string, Preset>);
