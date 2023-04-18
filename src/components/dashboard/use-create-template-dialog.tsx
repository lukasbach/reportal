import React, { useCallback, useEffect, useState } from "react";
import { ActionList, Button, Text } from "@primer/react";
import { PersonIcon, RepoIcon } from "@primer/octicons-react";
import { useDialog } from "../../dialogs";
import { RepoInput } from "../common/repo-input";
import { useCreateTemplate } from "./use-create-template";

enum Page {
  Create,
  RepoTemplate,
}

export const useCreateTemplateDialog = () => {
  const [page, setPage] = useState(Page.Create);

  const { createRepoTemplate, createUserTemplate } = useCreateTemplate(true);

  const [repo, setRepo] = useState("lukasbach/react-complex-tree");

  const { open, returnRef, dialog, isOpen } = useDialog({
    header: "Create dashboard from template",
    body:
      page === Page.Create ? (
        <>
          <Text>Which template do you want to use for your dashboard?</Text>
          <ActionList>
            <ActionList.Item onClick={() => setPage(Page.RepoTemplate)}>
              <ActionList.LeadingVisual>
                <RepoIcon size={16} />
              </ActionList.LeadingVisual>
              Repository Dashboard
              <ActionList.Description>Overview of one specific repo</ActionList.Description>
            </ActionList.Item>
            <ActionList.Item onClick={createUserTemplate}>
              <ActionList.LeadingVisual>
                <PersonIcon size={16} />
              </ActionList.LeadingVisual>
              User Dashboard
              <ActionList.Description>Overview of stuff relevant to your user</ActionList.Description>
            </ActionList.Item>
          </ActionList>
        </>
      ) : (
        <>
          <Text>Which repository do you want to use as a template?</Text>
          <RepoInput value={repo} onChange={setRepo} />
          <Button
            sx={{ mt: 2 }}
            variant="primary"
            onClick={() => {
              createRepoTemplate(...(repo.split("/", 2) as [string, string]));
            }}
          >
            Create
          </Button>
        </>
      ),
  });
  const createFromTemplate = useCallback(() => {
    open();
  }, [open]);

  useEffect(() => {
    if (!isOpen) {
      setPage(Page.Create);
      setRepo("lukasbach/react-complex-tree");
    }
  }, [isOpen]);

  return { createFromTemplate, dialog, open, returnRef };
};
