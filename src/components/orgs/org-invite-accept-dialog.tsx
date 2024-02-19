"use client";

import { api } from "@/trpc/react";
import { Dialog, DialogContent, type DialogProps } from "../ui/dialog";
import { Logo } from "../ui/logo";
import { Button } from "../ui/button";

interface Props extends DialogProps {
  orgName?: string;
  orgId: string;
  onClose: () => void;
}

export function OrgInviteAcceptModal({ open, onClose, orgName, orgId }: Props) {
  const apiUtils = api.useUtils();

  const closeModal = () => {
    onClose();
  };

  const acceptInviteMutation = api.org.acceptInvite.useMutation();

  const onSubmit = async () => {
    await acceptInviteMutation.mutateAsync({ orgId });
    await apiUtils.org.getById.invalidate({ id: orgId });
    await apiUtils.org.getAll.invalidate();
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
          <h3 className="mt-7 text-xl font-semibold">
            Organization Invitation
          </h3>
          <p className="text-dark-400 mt-3 leading-normal">
            You&apos;ve been invited to join and collaborate on the{" "}
            <span className="font-semibold">{orgName}</span> organization on
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
