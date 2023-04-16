import { FC } from "react";
import { Icon } from "@primer/octicons-react";
import { Octokit } from "@octokit/rest";

export type ActionDialog<T> = FC<{
  action: ActionDefinition<T>;
  items: T[];
  octokit: Octokit;
}>;

export abstract class ActionDefinition<T = any> {
  abstract readonly id: string;

  abstract readonly endpointId: string;

  abstract readonly name: string;

  abstract readonly description: string;

  abstract readonly icon: Icon;

  abstract readonly action: (items: T[], octokit: Octokit) => Promise<void>;

  abstract readonly dialog?: ActionDialog<T>;
}
