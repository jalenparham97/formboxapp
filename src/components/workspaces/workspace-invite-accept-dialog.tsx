"use client";

import { api } from "@/trpc/react";
import { Dialog, DialogContent, type DialogProps } from "../ui/dialog";
import { Logo } from "../ui/logo";
import { Button } from "../ui/button";

interface Props extends DialogProps {
  workspaceName?: string;
  workspaceId: string;
  onClose: () => void;
}

export default function WorkspaceInviteAcceptModal({
  open,
  onClose,
  workspaceName,
  workspaceId,
}: Props) {
  const apiUtils = api.useUtils();

  const closeModal = () => {
    onClose();
  };

  const acceptInviteMutation = api.workspace.acceptInvite.useMutation();

  const onSubmit = async () => {
    await acceptInviteMutation.mutateAsync({ workspaceId });
    await apiUtils.workspace.getById.invalidate({ id: workspaceId });
    await apiUtils.workspace.getAll.invalidate();
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        className="sm:max-w-[450px]"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        // onInteractOutside={(e) => e.preventDefault()}
        hideCloseButton
      >
        <div className="text-center">
          <div className="flex justify-center">
            <Logo noLink />
          </div>
          <h3 className="mt-7 text-xl font-semibold">Workspace Invitation</h3>
          <p className="text-dark-400 mt-3 leading-normal">
            You&apos;ve been invited to join and collaborate on the{" "}
            <span className="font-semibold">{workspaceName}</span> workspace on
            Formbox
          </p>
          <Button
            className="mt-7 w-full"
            onClick={onSubmit}
            loading={acceptInviteMutation.isLoading}
          >
            Accept invitation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
