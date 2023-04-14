import { ListEndpointDefinition, SearchQueryDefinition } from "./types";
import { cellRenderers } from "./cell-renderers";
import { repositoryResponseFields } from "./common-response-fields";

export class NotificationsEndpoint extends ListEndpointDefinition<any> {
  override readonly id = "notifications";

  override readonly name = "Notifications";

  override readonly defaultData = {
    endpointId: "notifications",
    search: "all:true",
    name: "My Notifications List",
    pinned: false,
    fields: ["subject.title", "updated_at", "reason"],
    fieldWidths: {},
  };

  override readonly responseFields = [
    { jsonKey: "id", name: "ID" },
    { jsonKey: "subject.title", name: "Title" },
    { jsonKey: "subject.type", name: "Type", suggestions: ["Issue", "PullRequest", "CheckSuite"] },
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
    { jsonKey: "updated_at", name: "Updated Date", renderCell: cellRenderers.date() },
    { jsonKey: "last_read_at", name: "Last Read Date", renderCell: cellRenderers.date() },
    { jsonKey: "repository.full_name", name: "Repo Name with Owner" },
    { jsonKey: "repository.description", name: "Repo Description" },
    { jsonKey: "repository.name", name: "Repo Name" },
    { jsonKey: "repository.owner.login", name: "Repo Owner Login" },
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
        all: filterMap.all?.value,
        participating: filterMap.participating?.value,
        since: filterMap.since?.value,
        before: filterMap.before?.value,
        per_page: pageSize,
        page: pageParam?.cursor,
      });

      // TODO use return headers x-poll-interval, last-modified

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
