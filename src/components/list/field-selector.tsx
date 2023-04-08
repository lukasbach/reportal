import React, { FC } from "react";
import { ActionMenu, ActionList } from "@primer/react";
import { GoCheck } from "react-icons/all";
import { ListEndpointDefinition } from "../../list-endpoints/types";

export type FieldSelectorProps = {
  endpoint: ListEndpointDefinition<any>;
  fields: string[];
  setFields: (fields: string[]) => void;
};

export const FieldSelector: FC<FieldSelectorProps> = ({ endpoint, fields, setFields }) => {
  return (
    <ActionMenu>
      <ActionMenu.Button aria-label="Choose columns...">Choose columns...</ActionMenu.Button>
      <ActionMenu.Overlay width="small">
        <ActionList selectionVariant="single" sx={{ maxHeight: "400px", overflow: "auto" }}>
          {endpoint.responseFields.map(({ name, jsonKey }) => {
            const isSelected = fields.indexOf(jsonKey) >= 0;
            return (
              <ActionList.Item
                key={jsonKey}
                selected={isSelected}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFields(isSelected ? fields.filter((f) => f !== jsonKey) : [...fields, jsonKey]);
                }}
              >
                {name}
              </ActionList.Item>
            );
          })}
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  );
};
