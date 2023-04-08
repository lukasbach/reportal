import { Action, ListEndpointDefinition, ResponseField, ServerFilter } from "./types";

export type IssueData = {
  author: {
    login: string;
    avatarUrl: string;
  };
  body: string;
  comments: {
    totalCount: number;
  };
  createdAt: string;
  editor: {
    login: string;
    avatarUrl: string;
  };
  id: string;
  labels: {
    nodes: {
      color: string;
      id: string;
      name: string;
    }[];
    totalCount: number;
  };
  repository: {
    name: string;
    nameWithOwner: string;
    owner: { login: string; avatarUrl: string };
    stargazerCount: string;
    url: string;
  };
  state: string;
  stateReason: string;
  title: string;
  updatedAt: string;
  url: string;
};

export class IssueSearchEndpoint extends ListEndpointDefinition<IssueData> {
  override readonly name = "Issues";

  override readonly responseFields = [];

  override readonly serverFilters = [
    { key: "type", suggestions: ["issue", "pr"] },
    { key: "in", suggestions: ["title", "body", "comments"], multiple: true },
    { key: "user" },
    { key: "org" },
    { key: "repo" },
    { key: "state", suggestions: ["open", "closed"] },
    { key: "is", suggestions: ["open", "closed", "queued", "public", "private"], multiple: true },
    { key: "reason", suggestions: ["completed", "not planned"] },
  ];

  override readonly actions;

  override async search({}) {
    return [];
  }
}
