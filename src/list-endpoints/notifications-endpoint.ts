import { SearchQueryDefinition } from "../common/filter-lists/types";
import { cellRenderers } from "../common/filter-lists/cell-renderers";
import { ListEndpointDefinition } from "../common/filter-lists/list-endpoint-definition";
import { EndpointId } from "./endpoints";

export class NotificationsEndpoint extends ListEndpointDefinition<any> {
  override readonly id = EndpointId.Notifications;

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

  override getSearchQueries(props): SearchQueryDefinition {
    const { octokit, filters, pageSize } = props;
    return async ({ pageParam }) => {
      const filterMap = this.getFiltersAsMap(filters);
      const start = parseInt(pageParam ?? "0", 10);
      const result = await octokit.activity.listNotificationsForAuthenticatedUser({
        all: filterMap.all?.value,
        participating: filterMap.participating?.value,
        since: filterMap.since?.value,
        before: filterMap.before?.value,
        per_page: pageSize,
        page: Math.floor(start / pageSize),
      });

      // TODO use return headers x-poll-interval, last-modified

      return {
        result: result.data,
        hasPreviousPage: start > 0,
        hasNextPage: true,
        endCursor: `${start + pageSize}`,
        startCursor: `${Math.max(0, start - pageSize)}`,
      };
    };
  }
}
