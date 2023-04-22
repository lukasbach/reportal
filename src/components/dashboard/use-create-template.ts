import { useNavigate } from "react-router";
import { useStableHandler } from "../../utils";
import { useCreateDashboard, useUpdateDashboard } from "../../firebase/dashboards";
import { useGithubAuthStore, useUserId } from "../../auth/hooks";
import { templates } from "./templates";

export const useCreateTemplate = (open = false) => {
  const createDashboard = useCreateDashboard();
  const updateDashboard = useUpdateDashboard();
  const navigate = useNavigate();
  const uid = useUserId();
  const login = useGithubAuthStore((state) => state.login);

  const createTemplate = useStableHandler(async (data: any) => {
    const doc = await createDashboard();
    await updateDashboard(doc.id, {
      user: uid,
      state: data,
    });
    const target = `/app/dashboards/${doc.id}`;
    if (open) {
      navigate(target);
    }
    return target;
  });

  const createRepoTemplate = useStableHandler(async (owner: string, repo: string) => {
    const template = templates.repo.replaceAll("%OWNER%", owner).replaceAll("%REPO%", repo);
    return createTemplate(JSON.parse(template));
  });

  const createUserTemplate = useStableHandler(async () => {
    const template = templates.user.replaceAll("%USER%", login ?? "@me");
    return createTemplate(JSON.parse(template));
  });

  return { createRepoTemplate, createUserTemplate };
};
