import type { RouterInputs, RouterOutputs } from "@/trpc/shared";
import type { InfiniteData } from "@tanstack/react-query";

export type WorkspaceCreateData = RouterInputs["workspace"]["createWorkspace"];
export type WorkspaceUpdateData = RouterInputs["workspace"]["updateById"];

export type WorkspacesOutput = RouterOutputs["workspace"]["getAll"];
export type WorkspaceOutput = RouterOutputs["workspace"]["getById"];

export type WorkspaceFindInput = RouterInputs["workspace"]["getAll"];

export type InfiniteWorkspacesData = InfiniteData<WorkspacesOutput> | undefined;

export const WorkspaceRoles = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export type MemberWithUserAndWorkspace = {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  workspace: {
    id: string;
    name: string | null;
  };
  createdAt: Date;
  role: string;
};
