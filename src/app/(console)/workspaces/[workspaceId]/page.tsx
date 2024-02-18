import { WorkspaceInvitePageWrapper } from "@/components/workspaces/workspace-invite-page-wrapper";
import { api } from "@/trpc/server";
import { TRPCClientError } from "@trpc/client";

interface Props {
  params: { workspaceId: string };
}

export default async function Workspace({ params: { workspaceId } }: Props) {
  let isInvitePending = false;
  let workspaceName = "";
  try {
    const workspace = await api.workspace.getById.query({ id: workspaceId });
  } catch (error) {
    if (error instanceof TRPCClientError) {
      isInvitePending = true;
      workspaceName = error.message.split("-")[1] as string;
    }
  }

  return (
    <WorkspaceInvitePageWrapper
      workspaceId={workspaceId}
      workspaceName={workspaceName}
      isInvitePending={isInvitePending}
    >
      {workspaceId}
    </WorkspaceInvitePageWrapper>
  );
}
