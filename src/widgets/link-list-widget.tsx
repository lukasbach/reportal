import React from "react";
import { LinkIcon, RepoIcon } from "@primer/octicons-react";
import { Textarea, Text, ActionList } from "@primer/react";
import { AbstractWidgetDefinition } from "../common/widgets/abstract-widget-definition";
import { WidgetConfigComponent, WidgetDisplayComponent } from "../common/widgets/types";
import { ConfigureWidgetEmptyState } from "../components/common/empty-states/configure-widget-empty-state";
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
        other page. Seperate the link from the label with a space.
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
      links: "octocat/Hello-World\nhttps://google.com Link Description goes here",
    };
  }

  readonly defaultSize = [5, 2] as const;

  static parseItems(links: string): ParsedLinkItem[] {
    return links
      .split("\n")
      .map((line) => {
        const [url, ...labelParts] = line.split(" ");
        const label = labelParts.join(" ") || undefined;
        if (url.startsWith("http")) {
          return {
            text: label ?? /https?:\/\/([^/]+)/.exec(url)?.[1] ?? url,
            url,
            icon: <LinkIcon size={16} />,
            label: label ? /https?:\/\/([^/]+)/.exec(url)?.[1] ?? url : undefined,
          };
        }
        if (/^[a-z0-9-]+\/[a-z0-9-]+$/i.test(url)) {
          return {
            text: url,
            url: `https://github.com/${url}`,
            icon: <RepoIcon size={16} />,
            label,
          };
        }
        return null;
      })
      .filter(isNotNullish);
  }
}
