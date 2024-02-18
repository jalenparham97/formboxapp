"use client";

import { useDialog } from "@/hooks/use-dialog";
import WorkspaceInviteAcceptDialog from "./workspace-invite-accept-dialog";

interface Props {
  isInvitePending: boolean;
  workspaceId: string;
  workspaceName: string;
  children: React.ReactNode;
}

export function WorkspaceInvitePageWrapper({
  children,
  isInvitePending,
  workspaceId,
  workspaceName,
}: Props) {
  const [acceptModal, acceptModalHandler] = useDialog(isInvitePending);
  console.log("INVITE PENDING: ", isInvitePending);
  return (
    <div>
      {children}
      <WorkspaceInviteAcceptDialog
        open={acceptModal}
        onClose={acceptModalHandler.close}
        workspaceName={workspaceName}
        workspaceId={workspaceId}
      />
    </div>
  );
}
