import { FieldType, SearchQueryDefinition } from "../common/filter-lists/types";
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
    { key: "id", name: "ID" },
    { key: "subject.title", name: "Title" },
    { key: "subject.type", name: "Type", suggestions: ["Issue", "PullRequest", "CheckSuite"] },
    { key: "unread", name: "Unread", type: FieldType.Boolean },
    {
      key: "reason",
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
    { key: "updated_at", name: "Updated Date", renderCell: cellRenderers.date() },
    { key: "last_read_at", name: "Last Read Date", renderCell: cellRenderers.date() },
    { key: "repository.full_name", name: "Repo Name with Owner" },
    { key: "repository.description", name: "Repo Description" },
    { key: "repository.name", name: "Repo Name" },
    { key: "repository.owner.login", name: "Repo Owner Login" },
  ];

  override readonly serverFilters = [
    { key: "all", type: FieldType.Boolean },
    { key: "participating", type: FieldType.Boolean },
    { key: "since" },
    { key: "before" },
  ];

  override orderByOptions = undefined;

  override getSelectedOrderBy: undefined;

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
