import { IssueSearchEndpoint } from "./issue-search-endpoint";
import { NotificationsEndpoint } from "./notifications-endpoint";
import { ListEndpointDefinition } from "./types";
import { EventsEndpoint } from "./events-endpoint";

export const endpoints: Record<string, ListEndpointDefinition> = {
  issues: new IssueSearchEndpoint(),
  notifications: new NotificationsEndpoint(),
  events: new EventsEndpoint(),
};

export const getEndpoint = (id: string) => {
  if (endpoints[id]) {
    return endpoints[id];
  }
  throw new Error(`Endpoint ${id} not found`);
};
