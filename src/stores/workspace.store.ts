import { create } from "zustand";

type WorkspaceModalStateStore = {
  workspaceModalState: boolean;
  setWorkspaceModalState: (workspaceModalState: boolean) => void;
};

export const useWorkspaceModalState = create<WorkspaceModalStateStore>()(
  (set) => ({
    workspaceModalState: false,
    setWorkspaceModalState: (workspaceModalState) =>
      set({ workspaceModalState }),
  }),
);
