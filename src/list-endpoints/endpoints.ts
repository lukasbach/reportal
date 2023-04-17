import { IssueSearchEndpoint } from "./issue-search-endpoint";
import { NotificationsEndpoint } from "./notifications-endpoint";
import { EventsEndpoint } from "./events-endpoint";
import { ListEndpointDefinition } from "../common/filter-lists/list-endpoint-definition";
import { ReposSearchEndpoint } from "./repos-search-endpoint";
import { DiscussionSearchEndpoint } from "./discussion-search-endpoint";

export enum EndpointId {
  Issues = "issues",
  Notifications = "notifications",
  Events = "events",
  Repos = "repos",
  Discussions = "discussions",
}

export const endpoints: Record<string, ListEndpointDefinition> = {
  issues: new IssueSearchEndpoint(),
  discussions: new DiscussionSearchEndpoint(),
  repos: new ReposSearchEndpoint(),
  notifications: new NotificationsEndpoint(),
  events: new EventsEndpoint(),
};

export const getEndpoint = (id: string) => {
  if (endpoints[id]) {
    return endpoints[id];
  }
  throw new Error(`Endpoint ${id} not found`);
};
