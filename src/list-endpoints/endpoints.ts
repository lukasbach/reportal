import { IssueSearchEndpoint } from "./issue-search-endpoint";
import { NotificationsEndpoint } from "./notifications-endpoint";
import { ListEndpointDefinition } from "./types";

export const endpoints: Record<string, ListEndpointDefinition> = {
  issues: new IssueSearchEndpoint(),
  notifications: new NotificationsEndpoint(),
};

export const getEndpoint = (id: string) => {
  if (endpoints[id]) {
    return endpoints[id];
  }
  throw new Error(`Endpoint ${id} not found`);
};
