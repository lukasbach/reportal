import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useOctokit } from "../auth/hooks";
import { useCreateTemplate } from "../components/dashboard/use-create-template";
import { TopUserReposQueryQuery } from "../gql/graphql";
import { useConfirm } from "../dialogs";

const query = /* GraphQL */ `
  query TopUserReposQuery {
    viewer {
      login
      repositories(
        first: 4
        orderBy: { field: STARGAZERS, direction: DESC }
        ownerAffiliations: OWNER
        isFork: false
        isLocked: false
      ) {
        nodes {
          owner {
            login
          }
          nameWithOwner
          name
        }
      }
    }
  }
`;

export const useProvisioning = () => {
  const { dialog, confirm } = useConfirm(
    "Welcome to Reportal!",
    "We created some sample dashboards for you to get started.",
    "Show me",
    null
  );
  const navigate = useNavigate();
  const { createRepoTemplate, createUserTemplate } = useCreateTemplate();
  const octokit = useOctokit();
  useEffect(() => {
    (async () => {
      const data: TopUserReposQueryQuery = await octokit.graphql(query);
      let target = "/app/dashboards";
      try {
        for (const repo of data?.viewer?.repositories?.nodes?.reverse() ?? []) {
          if (repo) {
            target = await createRepoTemplate(repo.owner.login, repo.name);
          }
        }
        await createUserTemplate();
      } catch (e) {
        console.error(e);
      }
      confirm().then(() => navigate(target));
    })();
  }, [confirm, createRepoTemplate, createUserTemplate, navigate, octokit]);
  return dialog;
};
