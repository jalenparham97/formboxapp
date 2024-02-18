"use client";

import { useWorkspaceAddMutation } from "@/queries/workspace.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  type DialogProps,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useWorkspaceModalState } from "@/stores/workspace.store";

const schema = z.object({
  name: z.string().min(1, "Workspace name is a required field."),
});

export function WorkspaceCreateDialog() {
  const { workspaceModalState, setWorkspaceModalState } =
    useWorkspaceModalState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ name: string }>({
    resolver: zodResolver(schema),
  });

  const handleWorkspaceCreate = useWorkspaceAddMutation();

  const closeModal = () => {
    reset();
    setWorkspaceModalState(false);
  };

  const onSubmit = async (data: { name: string }) => {
    await handleWorkspaceCreate.mutateAsync({ name: data.name });
    closeModal();
  };

  return (
    <Dialog open={workspaceModalState} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new workspace</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Group forms in workspaces per team, project, or department, and
          control member access to the forms.
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Workspace name"
              {...register("name")}
              error={errors.name !== undefined}
              errorMessage={errors?.name?.message}
              allowAutoComplete={false}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={closeModal} type="button">
              Close
            </Button>
            <Button loading={handleWorkspaceCreate.isLoading} type="submit">
              Create workspace
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
