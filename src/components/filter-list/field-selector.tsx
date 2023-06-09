import React, { FC, useMemo, useState } from "react";
import { SelectPanel, Button } from "@primer/react";

import { TriangleDownIcon } from "@primer/octicons-react";

import { ListEndpointDefinition } from "../../common/filter-lists/list-endpoint-definition";
import { isNotNullish } from "../../utils";

export type FieldSelectorProps = {
  endpoint: ListEndpointDefinition<any>;
  fields: string[];
  setFields: (fields: string[]) => void;
};

// TODO update only on close dialog
export const FieldSelector: FC<FieldSelectorProps> = ({ endpoint, fields, setFields }) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const items = useMemo(
    () =>
      endpoint.responseFields.map(({ name, key }) => ({
        text: name,
        id: key,
      })),
    [endpoint.responseFields]
  );

  const filteredItems = useMemo(() => {
    if (!filter) return items;
    return items.filter((item) => item.text.toLowerCase().indexOf(filter.toLowerCase()) >= 0);
  }, [filter, items]);

  return (
    <SelectPanel
      renderAnchor={({ children, "aria-labelledby": ariaLabelledBy, ...anchorProps }) => (
        <Button trailingAction={TriangleDownIcon} aria-labelledby={`${ariaLabelledBy}`} {...anchorProps}>
          {fields.length} columns
        </Button>
      )}
      placeholderText="Choose columns..."
      open={open}
      onOpenChange={setOpen}
      items={filteredItems}
      selected={fields.map((f) => items.find((i) => i.id === f)).filter(isNotNullish)}
      onSelectedChange={(items) => setFields(items.map((i) => i.id as string))}
      onFilterChange={setFilter}
      overlayProps={{ width: "small", height: "large" }}
    />
  );
};
