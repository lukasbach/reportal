import { BetterSystemStyleObject } from "@primer/react/lib/sx";

const baseStyles = {
  noWrap: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    minWidth: 0,
    display: "inline-block",
  },
  cellSpacing: {
    paddingY: 1,
    paddingX: 2,
  },
} satisfies Record<string, BetterSystemStyleObject>;

export const tableStyles = {
  table: {
    width: "fit-content",
    minWidth: "100%",
    overflow: "auto",
    fontSize: 1,
  },
  headerGroup: {
    bg: "canvas.inset",
    borderTop: "1px solid",
    borderBottom: "1px solid",
    borderColor: "border.default",
  },
  tableHead: {},
  tableHeadCell: {
    position: "relative",
    textAlign: "left",
    paddingY: 2,
    paddingX: 2,
    ":hover .resize-handle": { opacity: 1 },
    ...baseStyles.noWrap,
  },
  tableBody: {
    overflow: "auto",
  },
  resizeHandle: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "12px",
    // background: "rgba(0,0,0,0.1)",
    opacity: 0,
    cursor: "col-resize",
    // "user-select": "none",
    // "touch-action": "none",

    "> div": {
      height: "100%",
      marginRight: 1,
      borderRight: "1px solid",
      borderColor: "border.default",
    },
  },
  resizeHandleActive: {
    opacity: 1,
    "> div": {
      height: "100%",
      marginRight: 1,
      borderRight: "3px solid",
      borderColor: "accent.fg",
    },
  },
  row: {
    cursor: "pointer",
    borderBottom: "1px solid",
    borderColor: "border.muted",
    ":hover": { bg: "accent.subtle" },
    // ":nth-child(2n)": { bg: "canvas.subtle" },
    // ":nth-child(2n):hover": { bg: "accent.subtle" },
  },
  cell: {
    ...baseStyles.cellSpacing,
    ...baseStyles.noWrap,
  },
} satisfies Record<string, BetterSystemStyleObject>;
