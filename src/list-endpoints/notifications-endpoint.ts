import { ListEndpointDefinition, SearchQueryDefinition } from "./types";
import { cellRenderers } from "./cell-renderers";
import { repositoryResponseFields } from "./common-response-fields";

export class NotificationsEndpoint extends ListEndpointDefinition<any> {
  override readonly name = "Issues";

  override readonly defaultFields = ["number", "title", "author.login", "repository.nameWithOwner", "state"];

  override readonly responseFields = [
    { jsonKey: "id", name: "ID" },
    { jsonKey: "unread", name: "Unread", isBoolean: true },
    {
      jsonKey: "reason",
      name: "Reason",
      suggestions: [
        "assign",
        "author",
        "comment",
        "ci_activity",
        "invitation",
        "manual",
        "mention",
        "review_requested",
        "security_alert",
        "state_change",
        "subscribed",
        "team_mention",
      ],
    },
    { jsonKey: "updated_at", name: "Updated Date", renderCell: cellRenderers.date },
    { jsonKey: "last_read_at", name: "Last Read Date", renderCell: cellRenderers.date },
    { jsonKey: "subject.title", name: "Title" },
    { jsonKey: "subject.type", name: "Type", suggestions: ["Issue", "PullRequest", "CheckSuite"] },
    ...repositoryResponseFields,
    { jsonKey: "body", name: "Body" },
    { jsonKey: "closedAt", name: "Closed Date", renderCell: cellRenderers.date },
    { jsonKey: "comments.totalCount", name: "Comments Count" },
    { jsonKey: "createdAt", name: "Created Date", renderCell: cellRenderers.date },
    { jsonKey: "state", name: "State" },
    { jsonKey: "stateReason", name: "State Reason" },
    { jsonKey: "updatedAt", name: "Updated Date", renderCell: cellRenderers.date },
    { jsonKey: "url", name: "URL" },
  ];

  override readonly serverFilters = [
    { key: "all", isBoolean: true },
    { key: "participating", isBoolean: true },
    { key: "since" },
    { key: "before" },
  ];

  override readonly actions;

  override getSearchQueries(props): SearchQueryDefinition {
    const { octokit, filters, pageSize } = props;
    return async ({ pageParam }) => {
      const filterMap = this.getFiltersAsMap(filters);
      const start = parseInt(pageParam?.cursor ?? "0", 10);
      const result = await octokit.activity.listNotificationsForAuthenticatedUser({
        all: filterMap.all.value,
        participating: filterMap.participating.value,
        since: filterMap.since.value,
        before: filterMap.before.value,
        per_page: pageSize,
        page: pageParam?.cursor,
      });
      console.log("!", result);

      return {
        result: result.data,
        hasPreviousPage: start > 0,
        hasNextPage: true,
        endCursor: `${(pageParam?.cursor ?? 0) + pageSize}`,
        startCursor: `${Math.max(0, start - pageSize)}`,
      };
    };
  }
}
