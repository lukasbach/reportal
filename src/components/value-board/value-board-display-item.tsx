import React, { FC, ReactNode } from "react";
import { ValueBoardItem } from "../../widgets/value-board-widget";
import { useCountListItems } from "../../list-endpoints/use-count-list-items";
import { getEndpoint } from "../../list-endpoints/endpoints";
import { useUnwrapEmbeddedFilterListConfig } from "../filter-list/use-unwrap-embedded-filter-list-config";
import { parseSearch } from "../../list-endpoints/search-utils";

export type ValueBoardDisplayItemProps<T extends string = ValueBoardItem["type"]> = {
  config: ValueBoardItem & { type: T };
};

const FilterListTotalDisplay: FC<ValueBoardDisplayItemProps<"filterListTotal">> = ({ config }) => {
  const { data } = useUnwrapEmbeddedFilterListConfig(config.filterList);
  const value = useCountListItems(
    data?.endpointId ? getEndpoint(data.endpointId) : null,
    data?.search && data?.endpointId ? parseSearch(data.search, getEndpoint(data.endpointId)) : null
  );
  return (
    <div>
      {value} - {config.name}
    </div>
  );
};

export const ValueBoardDisplayItem: FC<ValueBoardDisplayItemProps> = (props) => {
  const { config } = props;
  if (config.type === "filterListTotal") {
    return <FilterListTotalDisplay {...(props as any)} />;
  }

  return null;
};
