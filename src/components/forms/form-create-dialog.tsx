"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type DialogProps,
} from "../ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { type FormCreateFields } from "@/types/form.types";
import { formCreateSchema } from "@/utils/schemas";
import { useFormAddMutation } from "@/queries/form.queries";

interface Props extends DialogProps {
  orgId: string;
  onClose: () => void;
}

export function FormCreateDialog({ open, onClose, orgId }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormCreateFields>({
    resolver: zodResolver(formCreateSchema),
    defaultValues: {
      orgId,
    },
  });

  const createFormMutation = useFormAddMutation();

  const closeModal = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormCreateFields) => {
    await createFormMutation.mutateAsync(data);
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[465px]">
        <DialogHeader>
          <DialogTitle>Create a new form</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div>
            <Input
              label="Form name"
              {...register("name")}
              allowAutoComplete={false}
              error={errors.name !== undefined}
              errorMessage={errors?.name?.message}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={closeModal} type="button">
              Close
            </Button>
            <Button loading={isSubmitting} type="submit">
              Create form
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
