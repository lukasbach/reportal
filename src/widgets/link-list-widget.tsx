import React from "react";
import { LinkIcon, RepoIcon } from "@primer/octicons-react";
import { Textarea, Text, ActionList } from "@primer/react";
import { AbstractWidgetDefinition } from "../common/widgets/abstract-widget-definition";
import { WidgetConfigComponent, WidgetDisplayComponent } from "../common/widgets/types";
import { FilterListEmbeddedContainer } from "../components/filter-list/filter-list-embedded-container";
import { ConfigureWidgetEmptyState } from "../components/common/empty-states/configure-widget-empty-state";
import { useUnwrapEmbeddedFilterListConfig } from "../components/filter-list/use-unwrap-embedded-filter-list-config";
import { isNotNullish } from "../utils";

type LinkListWidgetConfig = {
  links: string;
};

type ParsedLinkItem = {
  text: string;
  label?: string;
  url: string;
  icon: JSX.Element;
};

const ConfigComponent: WidgetConfigComponent<LinkListWidgetConfig> = ({ config, onChange }) => {
  return (
    <>
      <Text fontSize={1}>
        Enter one link per line. You can enter &quot;user/repo&quot; to link to a repo, or a full URL to link to any
        other page.
      </Text>
      <Textarea
        sx={{ width: "100%" }}
        placeholder="one link per line"
        onChange={(e) => onChange({ links: e.target.value })}
        value={config.links}
      />
    </>
  );
};

const DisplayComponent: WidgetDisplayComponent<LinkListWidgetConfig> = ({ config, onEdit }) => {
  if (config.links.trim() === "") {
    return <ConfigureWidgetEmptyState onEdit={onEdit} />;
  }

  return (
    <ActionList>
      {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
      {LinkListWidget.parseItems(config.links).map(({ url, text, label, icon }) => (
        <ActionList.LinkItem key={url} href={url} target="_blank">
          {icon && <ActionList.LeadingVisual>{icon}</ActionList.LeadingVisual>}
          {text}
          {label && <ActionList.Description>{label}</ActionList.Description>}
        </ActionList.LinkItem>
      ))}
    </ActionList>
  );
};

export class LinkListWidget extends AbstractWidgetDefinition<LinkListWidgetConfig> {
  override id = "linkList";

  override name = "Link List";

  override displayComponent = DisplayComponent;

  override configComponent = ConfigComponent;

  override iconComponent = () => <LinkIcon size={16} />;

  override generalIconComponent = () => <LinkIcon size={16} />;

  override async generateDefaultConfig(): Promise<LinkListWidgetConfig> {
    return {
      links: "octocat/Hello-World\nhttps://google.com",
    };
  }

  readonly defaultSize = [5, 2] as const;

  static parseItems(links: string): ParsedLinkItem[] {
    return links
      .split("\n")
      .map((line) => {
        if (line.startsWith("http")) {
          return {
            text: /https?:\/\/([^/]+)/.exec(line)?.[1] ?? line,
            url: line,
            icon: <LinkIcon size={16} />,
          };
        }
        if (/^[a-z0-9-]+\/[a-z0-9-]+$/i.test(line)) {
          return {
            text: line,
            url: `https://github.com/${line}`,
            icon: <RepoIcon size={16} />,
          };
        }
        return null;
      })
      .filter(isNotNullish);
  }
}
