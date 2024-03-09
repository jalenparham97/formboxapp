"use client";

import {
  IconBolt,
  IconDots,
  IconInbox,
  IconPencil,
  IconSettings,
  IconShare,
  IconTrash,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";
import Link from "next/link";
import { type SubmissionOutput } from "@/types/submission.types";
import { useSubmissionDeleteMutation } from "@/queries/submissions.queries";
import { DeleteDialog } from "../ui/delete-dialog";

interface Props {
  submission: SubmissionOutput;
}

export function SubmissionCardActionsMenu({ submission }: Props) {
  const [openDialog, openDialogHandlers] = useDialog();

  const handleDeleteForm = useSubmissionDeleteMutation(
    submission?.formId as string,
  );

  const onDelete = async () => {
    await handleDeleteForm.mutateAsync({ id: submission?.id as string });
    openDialogHandlers.close();
  };

  return (
    <div>
      {submission && (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="h-auto p-1.5 text-gray-400">
                <IconDots size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[170px]">
              {/* <Link href={`/editor/${form.id}/create`}>
                <DropdownMenuItem>
                  <IconPencil className="mr-2 h-4 w-4" />
                  <span>Edit form</span>
                </DropdownMenuItem>
              </Link>
              <Link href={`/dashboard/${form.orgId}/forms/${form.id}`}>
                <DropdownMenuItem>
                  <IconInbox className="mr-2 h-4 w-4" />
                  <span>Submissions</span>
                </DropdownMenuItem>
              </Link>
              <Link href={`/dashboard/${form.orgId}/forms/${form.id}/share`}>
                <DropdownMenuItem>
                  <IconShare className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
              </Link>
              <Link
                href={`/dashboard/${form.orgId}/forms/${form.id}/integrations`}
              >
                <DropdownMenuItem>
                  <IconBolt className="mr-2 h-4 w-4" />
                  <span>Integrations</span>
                </DropdownMenuItem>
              </Link>
              <Link href={`/dashboard/${form.orgId}/forms/${form.id}/settings`}>
                <DropdownMenuItem>
                  <IconSettings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link> */}
              <DropdownMenuItem
                className="!text-red-500 hover:!bg-red-500/5"
                onClick={(e) => {
                  e.stopPropagation();
                  openDialogHandlers.open();
                }}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteDialog
            title="submission"
            open={openDialog}
            onClose={openDialogHandlers.close}
            onDelete={onDelete}
            loading={handleDeleteForm.isLoading}
          />
        </div>
      )}
    </div>
  );
}
