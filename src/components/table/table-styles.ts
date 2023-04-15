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
    paddingY: "8px",
    paddingX: 2,
  },
} satisfies Record<string, BetterSystemStyleObject>;

export const tableStyles = {
  table: {
    height: "100%",
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
    boxShadow: "primer.shadow.inset",
    whiteSpace: "nowrap",
  },
  tableHead: {},
  tableHeadCell: {
    position: "relative",
    textAlign: "left",
    paddingY: 2,
    paddingX: 2,
    ":hover .resize-handle": { opacity: 1 },
    ":hover .grab-handle": { opacity: 1 },
    ...baseStyles.noWrap,
  },
  tableHeadCellDropping: {
    bg: "accent.subtle",
  },
  tableBody: {
    overflowY: "auto",
    flexGrow: 1,
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
    minWidth: "100%",
    whiteSpace: "nowrap",
    ":hover": { bg: "accent.subtle" },
    ":hover .checkbox-cell": {
      borderColor: "accent.fg",
    },
    // ":nth-child(2n)": { bg: "canvas.subtle" },
    // ":nth-child(2n):hover": { bg: "accent.subtle" },
  },
  cell: {
    ...baseStyles.cellSpacing,
    ...baseStyles.noWrap,
  },
  checkboxCell: {
    ...baseStyles.cellSpacing,
    ...baseStyles.noWrap,
    width: "30px",
    height: "100%",
    borderLeft: "3px solid",
    borderColor: "transparent",
  },
  checkbox: {
    bg: "canvas.default",
  },
  grabber: {
    opacity: 0,
    cursor: "grab",
    position: "absolute",
    top: "10px",
    right: 2,
    borderRadius: "4px",
    ":hover": {
      bg: "default.muted",
    },
  },
} satisfies Record<string, BetterSystemStyleObject>;
