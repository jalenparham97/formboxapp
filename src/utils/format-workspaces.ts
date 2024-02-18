import {
  type InfiniteWorkspacesData,
  type WorkspacesOutput,
} from "@/types/workspace.types";

export const formatWorkspaces = (workspaces: InfiniteWorkspacesData) => {
  let data: WorkspacesOutput["data"] = [];
  if (workspaces) {
    for (const page of workspaces.pages) {
      data = [...data, ...page.data];
    }
    return data.map((workspace) => ({
      ...workspace,
    }));
  }
  return data;
};
