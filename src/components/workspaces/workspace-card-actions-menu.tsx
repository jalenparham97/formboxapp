"use client";

import {
  IconDots,
  IconFileText,
  IconSettings,
  IconTrash,
  IconUsers,
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
import { useWorkspaceDeleteMutation } from "@/queries/workspace.queries";
import { type WorkspacesOutput } from "@/types/workspace.types";
import { WorkspaceDeleteDialog } from "./workspace-delete-dialog";

interface Props {
  workspace: WorkspacesOutput["data"][0];
}

export function WorkspaceCardActionMenu({ workspace }: Props) {
  const [openDialog, openDialogHandlers] = useDialog();

  const handleDeleteWorkspace = useWorkspaceDeleteMutation();

  const onDeleteWorkspace = async () => {
    await handleDeleteWorkspace.mutateAsync({ id: workspace.id });
    openDialogHandlers.close();
  };

  return (
    <div>
      {workspace.id && (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="h-auto p-1.5 text-gray-400">
                <IconDots size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[170px]">
              <Link href={`/workspaces/${workspace.id}`}>
                <DropdownMenuItem>
                  <IconFileText className="mr-2 h-4 w-4" />
                  <span>View forms</span>
                </DropdownMenuItem>
              </Link>
              <Link href={`/workspaces/${workspace.id}/members`}>
                <DropdownMenuItem>
                  <IconUsers className="mr-2 h-4 w-4" />
                  <span>Team members</span>
                </DropdownMenuItem>
              </Link>
              <Link href={`/workspaces/${workspace.id}/settings`}>
                <DropdownMenuItem>
                  <IconSettings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="!text-red-500 hover:!bg-red-500/5"
                onClick={openDialogHandlers.open}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <WorkspaceDeleteDialog
            title={workspace?.name}
            open={openDialog}
            onClose={openDialogHandlers.close}
            onDelete={onDeleteWorkspace}
            loading={handleDeleteWorkspace.isLoading}
          />
        </div>
      )}
    </div>
  );
}
