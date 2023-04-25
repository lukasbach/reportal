import { ListField } from "./types";
import { cellRenderers } from "./cell-renderers";

export const repositoryResponseFields: ListField[] = [
  { key: "repository.nameWithOwner", name: "Repo Name with Owner" },
  { key: "repository.description", name: "Repo Description" },
  { key: "repository.createdAt", name: "Repo Created Date", renderCell: cellRenderers.date() },
  { key: "repository.homepageUrl", name: "Repo Homepage" },
  { key: "repository.name", name: "Repo Name" },
  { key: "repository.owner.login", name: "Repo Owner Login" },
  { key: "repository.stargazerCount", name: "Repo Stargazer Count" },
];
