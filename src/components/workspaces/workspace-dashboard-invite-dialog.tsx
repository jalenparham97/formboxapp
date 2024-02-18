import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  type DialogProps,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useMemo } from "react";
import {
  useCreateWorkspaceInviteMutation,
  useWorkspaces,
} from "@/queries/workspace.queries";
import { Autocomplete } from "@/components/ui/autocomplete";

type InvitationData = { email: string; workspaceName: string };

const schema = z.object({
  email: z
    .string({ required_error: "Email is a required field." })
    .email({ message: "Please enter a valid email." }),
  workspaceName: z.string({ required_error: "Workspace is a required field." }),
});

interface Props extends DialogProps {
  onClose: () => void;
}

export function WorkspaceDashboardInviteDialog({ onClose, open }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<InvitationData>({
    resolver: zodResolver(schema),
  });

  const { data: workspaces } = useWorkspaces();
  const createInviteMutation = useCreateWorkspaceInviteMutation();

  const closeModal = () => {
    reset();
    onClose();
  };

  const onSubmit = async ({ email, workspaceName }: InvitationData) => {
    const workspace = workspaces?.data?.find(
      (workspace) => workspace.name === workspaceName,
    );
    await createInviteMutation.mutateAsync({
      email,
      workspaceId: workspace?.id || "",
      workspaceName: workspace?.name || "",
    });
    closeModal();
  };

  const handleWorkspaceChange = (selectedWorkspace: any) => {
    return selectedWorkspace.value as string;
  };

  const options = useMemo(
    () =>
      workspaces?.data?.map((workspace) => ({
        value: workspace.name,
        label: workspace.name,
      })),
    [workspaces],
  );

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Invite a team member to join your workspace. Invitations will be valid
          for 7 days.
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Email"
              {...register("email")}
              error={errors.email !== undefined}
              errorMessage={errors?.email?.message}
            />
            <Controller
              name="workspaceName"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  ref={field.ref}
                  label="Choose a workspace"
                  placeholder=""
                  options={options}
                  onChange={(val) => field.onChange(handleWorkspaceChange(val))}
                  error={errors.workspaceName !== undefined}
                  errorMessage={errors?.workspaceName?.message}
                />
              )}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={closeModal} type="button">
              Close
            </Button>
            <Button loading={isSubmitting} type="submit">
              Send member invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
