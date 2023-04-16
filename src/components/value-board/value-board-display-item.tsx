import React, { FC, ReactNode } from "react";
import { ValueBoardItem } from "../../widgets/value-board-widget";
import { useCountListItems } from "../../common/filter-lists/use-count-list-items";
import { getEndpoint } from "../../list-endpoints/endpoints";
import { useUnwrapEmbeddedFilterListConfig } from "../filter-list/use-unwrap-embedded-filter-list-config";
import { parseSearch } from "../../common/filter-lists/search-utils";
import { ValueBoardStat } from "./value-board-stat";
import { useRepoData } from "../../common/use-repo-data";
import { resolveRecursiveSubitem } from "../../utils";

export type ValueBoardDisplayItemProps<T extends string = ValueBoardItem["type"]> = {
  config: ValueBoardItem & { type: T };
};

const FilterListTotalDisplay: FC<ValueBoardDisplayItemProps<"filterListTotal">> = ({ config }) => {
  const { data } = useUnwrapEmbeddedFilterListConfig(config.filterList);
  const value = useCountListItems(
    data?.endpointId ? getEndpoint(data.endpointId) : null,
    data?.search && data?.endpointId ? parseSearch(data.search, getEndpoint(data.endpointId)) : null
  );
  return <ValueBoardStat value={value} label={config.name} />;
};

const RepoStatDisplay: FC<ValueBoardDisplayItemProps<"repoStat">> = ({ config }) => {
  const [owner, repo] = config.repo.split("/", 2);
  const repoData = useRepoData(owner, repo);
  if (!repoData) {
    return null;
  }
  const value = resolveRecursiveSubitem(repoData, config.statKey);
  return <ValueBoardStat value={value} label={config.name} />;
};

export const ValueBoardDisplayItem: FC<ValueBoardDisplayItemProps> = (props) => {
  const { config } = props;
  if (config.type === "filterListTotal") {
    return <FilterListTotalDisplay {...(props as any)} />;
  }
  if (config.type === "repoStat") {
    return <RepoStatDisplay {...(props as any)} />;
  }

  return null;
};
