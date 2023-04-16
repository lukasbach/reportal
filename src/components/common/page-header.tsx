import React, { FC, ReactNode } from "react";
import { Box, IconButton } from "@primer/react";
import { ChevronLeftIcon } from "@primer/octicons-react";
import { Link } from "react-router-dom";

export type PageHeaderProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  icon?: JSX.Element;
  backLink?: string;
  compact?: boolean;
};

export const PageHeader: FC<PageHeaderProps> = ({ children, title, subtitle, icon, backLink, compact }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {backLink && (
        <Box mr={3}>
          <IconButton to={backLink} as={Link} icon={ChevronLeftIcon} aria-label="Back" />
        </Box>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <Box as="h1" m={0}>
          {title}
        </Box>
        {subtitle && (
          <Box fontSize={1} color="fg.muted" maxWidth="600px">
            {subtitle}
          </Box>
        )}
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};
