import { BetterSystemStyleObject } from "@primer/react/lib/sx";

const baseStyles = {
  noWrap: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    minWidth: 0,
    display: "inline-block",
  },
} satisfies Record<string, BetterSystemStyleObject>;

export const tableStyles = {
  table: {
    width: "fit-content",
  },
  tableRow: { display: "flex", width: "fit-content" },
  tableHead: { position: "relative", ":hover .resize-handle": { opacity: 1 }, ...baseStyles.noWrap },
  resizeHandle: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    width: "8px",
    background: "rgba(0,0,0,0.5)",
    opacity: 0,
    cursor: "col-resize",
    "user-select": "none",
    "touch-action": "none",
  },
  resizeHandleActive: {
    background: "blue",
    opacity: 1,
  },
  cell: {
    ...baseStyles.noWrap,
  },
} satisfies Record<string, BetterSystemStyleObject>;
