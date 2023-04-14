import { ResponseField } from "./types";
import { cellRenderers } from "./cell-renderers";

export const repositoryResponseFields: ResponseField[] = [
  { jsonKey: "repository.nameWithOwner", name: "Repo Name with Owner" },
  { jsonKey: "repository.description", name: "Repo Description" },
  { jsonKey: "repository.createdAt", name: "Repo Created Date", renderCell: cellRenderers.date },
  { jsonKey: "repository.homepageUrl", name: "Repo Homepage" },
  { jsonKey: "repository.name", name: "Repo Name" },
  { jsonKey: "repository.owner.login", name: "Repo Owner Login" },
  { jsonKey: "repository.stargazerCount", name: "Repo Stargazer Count" },
];
