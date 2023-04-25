import { Octokit } from "@octokit/rest";
import { FieldType, FilterValue, SearchQueryDefinition, ListField } from "../common/filter-lists/types";
import { cellRenderers } from "../common/filter-lists/cell-renderers";
import { ListEndpointDefinition } from "../common/filter-lists/list-endpoint-definition";
import { EndpointId } from "./endpoints";

export class EventsEndpoint extends ListEndpointDefinition<any> {
  override readonly id = EndpointId.Events;

  override readonly name = "Events";

  override readonly defaultData = {
    endpointId: "events",
    search: "user:lukasbach",
    name: "My Event List",
    pinned: false,
    fields: ["type", "repo.name", "actor.login", "created_at"],
    fieldWidths: {},
  };

  override readonly responseFields = [
    { key: "id", name: "ID" },
    {
      key: "type",
      name: "Event Type",
      suggestions: [
        "CommitCommentEvent",
        "CreateEvent",
        "DeleteEvent",
        "ForkEvent",
        "GollumEvent",
        "IssueCommentEvent",
        "IssuesEvent",
        "MemberEvent",
        "PublicEvent",
        "PullRequestEvent",
        "PullRequestReviewEvent",
        "PullRequestReviewCommentEvent",
        "PullRequestReviewThreadEvent",
        "PushEvent",
        "ReleaseEvent",
        "SponsorshipEvent",
        "WatchEvent",
      ],
      renderCell: cellRenderers.eventType(),
    },
    { key: "actor.login", name: "Actor Login", renderCell: cellRenderers.author("actor", "login", "avatar_url") },
    { key: "repo.name", name: "Repo Name" },
    { key: "public", name: "Public", type: FieldType.Boolean },
    { key: "created_at", name: "Created Date", renderCell: cellRenderers.date() },

    // TODO https://docs.github.com/en/webhooks-and-events/events/github-event-types#commitcommentevent
  ];

  override readonly serverFilters = [
    { key: "user" },
    { key: "receivedby" },
    { key: "repo" },
    { key: "org" },
    { key: "public", type: FieldType.Boolean },
  ];

  override orderByOptions = undefined;

  override getSelectedOrderBy: undefined;

  override getSearchQueries(props): SearchQueryDefinition {
    const { octokit, filters, pageSize } = props;
    return async ({ pageParam }) => {
      const start = parseInt(pageParam ?? "0", 10);
      const result = await this.fetch(octokit, filters, {
        page: Math.floor(start / pageSize),
        per_page: pageSize,
      });

      // TODO use return headers x-poll-interval, if-none-match, etag
      // TODO use return headers link<prev, next, last, first>

      return {
        result: result.data,
        hasPreviousPage: start > 0,
        hasNextPage: true,
        endCursor: `${start + pageSize}`,
        startCursor: `${Math.max(0, start - pageSize)}`,
      };
    };
  }

  private fetch(octokit: Octokit, filters: FilterValue<ListField>[], page: { page: number; per_page: number }) {
    const filterMap = this.getFiltersAsMap(filters);
    console.log("!", filterMap);
    // TODO replace @me with my username, maybe even globally in all queries

    if (filterMap.repo) {
      const [owner, repo] = filterMap.repo.value.split("/");
      return octokit.request("GET /repos/{owner}/{repo}/events", {
        owner,
        repo,
        ...page,
      });
    }

    if (filterMap.org) {
      if (filterMap.public?.value === "true") {
        return octokit.request("GET /orgs/{org}/events", {
          org: filterMap.org.value,
          ...page,
        });
      }
      // TODO
      /* return octokit.request("GET /users/{username}/events/orgs/{org}", {
        org: filterMap.org.value,
        ...page,
      }); */
    }

    if (filterMap.user) {
      if (filterMap.public?.value === "true") {
        return octokit.request("GET /users/{username}/events", {
          username: filterMap.org.value,
          ...page,
        });
      }
      return octokit.request("GET /users/{username}/events", {
        username: filterMap.user.value,
        ...page,
      });
    }

    if (filterMap.receivedby) {
      if (filterMap.public?.value === "true") {
        return octokit.request("GET /users/{username}/received_events", {
          username: filterMap.receivedby.value,
          ...page,
        });
      }
      return octokit.request("GET /users/{username}/received_events", {
        username: filterMap.receivedby.value,
        ...page,
      });
    }

    return octokit.request("GET /events", page);
  }
}
