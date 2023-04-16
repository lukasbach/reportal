import { AddTagsAction } from "./add-tags-action";

export const actionDefinitions = [new AddTagsAction()];

export const getActionsForEndpoint = (endpointId: string) => {
  return actionDefinitions.filter((action) => action.endpointId === endpointId);
};
