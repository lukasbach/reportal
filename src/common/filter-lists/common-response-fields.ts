import { ListField } from "./types";
import { ListFieldBuilder } from "./list-field-builder";

export const repositoryResponseFields: ListField[] = [
  ListFieldBuilder.from("repository.nameWithOwner", "Repo Name with Owner").repoName().f,
  ListFieldBuilder.from("repository.description", "Repo Description").text().f,
  ListFieldBuilder.from("repository.createdAt", "Repo Created Date").date().f,
  ListFieldBuilder.from("repository.homepageUrl", "Repo Homepage").url().f,
  ListFieldBuilder.from("repository.name", "Repo Name").text().f,
  ListFieldBuilder.from("repository.owner", "Repo Owner Login").user().f,
  ListFieldBuilder.from("repository.stargazerCount", "Repo Stargazer Count").number().f,
];
