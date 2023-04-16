import { TagIcon } from "@primer/octicons-react";
import { ActionDefinition } from "../common/actions/action-definition";
import { EndpointId } from "../list-endpoints/endpoints";

export class AddTagsAction extends ActionDefinition {
  readonly id = "add-tags";

  readonly endpointId = EndpointId.Issues;

  readonly name = "Add Tags";

  readonly description = "Add tags to issues";

  readonly icon = TagIcon;

  readonly action = async (items: any) => {
    console.log("Add tags", items);
  };

  readonly dialog = undefined;
}
