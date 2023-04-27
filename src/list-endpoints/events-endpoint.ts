import { Octokit } from "@octokit/rest";
import type { components } from "@octokit/openapi-types";
import { FilterValue, SearchQueryDefinition, ListField } from "../common/filter-lists/types";
import { ListEndpointDefinition } from "../common/filter-lists/list-endpoint-definition";
import { EndpointId } from "./endpoints";
import { cellRenderers } from "../common/filter-lists/cell-renderers";
import { useDetailsStore } from "../components/details/use-details-store";

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
    this.f("id", "ID").text().f,
    this.f("type", "Event Type")
      .enum(
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
        "WatchEvent"
      )
      .withRenderer(cellRenderers.eventType()).f,
    this.f("actor", "Actor Login").user("login", "avatar_url").f,
    this.f("repo.name", "Repo Name").text().f,
    this.f("public", "Public").boolean().f,
    this.f("created_at", "Created Date").date().f,

    // TODO https://docs.github.com/en/webhooks-and-events/events/github-event-types#commitcommentevent
  ];

  override readonly serverFilters = [
    this.f("user", "User").user("login", "avatar_url").f,
    this.f("receivedby", "Received By").date().f,
    this.f("repo", "Repo").repoName().f,
    this.f("org", "Org").text().f,
    this.f("public", "Public").boolean().f,
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
          username: filterMap.user.value,
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

  override clickAction(item: components["schemas"]["event"]) {
    const [owner, repo] = item.repo.name.split("/");

    // TODO scroll to comment if item.payload.comment

    if (item.payload.issue) {
      useDetailsStore
        .getState()
        .openIssue(owner, repo, item.payload.issue.number, false, item.payload.comment?.node_id);
      return;
    }

    if (item.payload.pages?.[0]?.html_url) {
      window.open(item.payload.pages?.[0]?.html_url, "_blank");
      return;
    }

    window.open(`https://github.com/${item.repo.name}`, "_blank");
  }
}
