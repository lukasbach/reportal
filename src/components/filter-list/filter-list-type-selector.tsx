import React, { FC, ReactNode } from "react";
import { ActionList, ActionMenu } from "@primer/react";
import type { ButtonBaseProps } from "@primer/react/lib/Button/types";
import { endpoints } from "../../list-endpoints/endpoints";
import { EndpointIcon } from "../common/endpoint-icon";

import { ListEndpointDefinition } from "../../common/filter-lists/list-endpoint-definition";

export type FilterListTypeSelectorProps = Omit<ButtonBaseProps, "onClick"> & {
  children: ReactNode;
  onClick: (endpoint: ListEndpointDefinition) => void;
  selectedEndpoint?: string;
};

export const FilterListTypeSelector: FC<FilterListTypeSelectorProps> = ({
  children,
  selectedEndpoint,
  onClick,
  ...buttonProps
}) => {
  return (
    <ActionMenu>
      <ActionMenu.Button {...buttonProps}>{children}</ActionMenu.Button>

      <ActionMenu.Overlay>
        <ActionList sx={{ width: "240px" }}>
          {Object.values(endpoints).map((endpoint) => (
            <ActionList.Item
              key={endpoint.id}
              onClick={() => onClick(endpoint)}
              active={selectedEndpoint === endpoint.id}
            >
              <ActionList.LeadingVisual>
                <EndpointIcon endpointId={endpoint.id} size={16} />
              </ActionList.LeadingVisual>
              {endpoint.name}
            </ActionList.Item>
          ))}
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  );
};
