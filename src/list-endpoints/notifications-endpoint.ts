import { SearchQueryDefinition } from "../common/filter-lists/types";
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
    this.f("id", "ID").text().f,
    this.f("subject.title", "Title").text().f,
    this.f("subject.type", "Type").enum("Issue", "PullRequest", "CheckSuite").f,
    this.f("unread", "Unread").boolean().f,
    this.f("reason", "Reason").enum(
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
      "team_mention"
    ).f,
    this.f("updated_at", "Updated Date").date().f,
    this.f("last_read_at", "Last Read Date").date().f,
    this.f("repository.full_name", "Repo Name").repoName().f,
    this.f("repository.description", "Repo Description").text().f,
    this.f("repository.name", "Repo Name").repoName().f,
    this.f("repository.owner", "Repo Owner").user().f,
  ];

  override readonly serverFilters = [
    this.f("all", "Show all").boolean().withDescription("Show all notifications, not only unread ones?").f,
    this.f("participating", "Participating").boolean().f,
    this.f("since", "Notifications since date").date().f,
    this.f("before", "Notifications before date").date().f,
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
