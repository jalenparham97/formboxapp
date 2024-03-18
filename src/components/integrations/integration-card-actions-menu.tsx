"use client";

import {
  IconDots,
  IconExternalLink,
  IconSettings,
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
import { type IntegrationOutput } from "@/types/integration.types";
import { useIntegrationDeleteMutation } from "@/queries/integration.queries";
import { DeleteDialog } from "../ui/delete-dialog";

interface Props {
  integration: IntegrationOutput | null | undefined;
  disabled?: boolean;
}

export function IntegrationCardActionsMenu({
  integration,
  disabled = false,
}: Props) {
  const [openDialog, openDialogHandlers] = useDialog();

  const handleDelete = useIntegrationDeleteMutation(
    integration?.formId as string,
  );

  const onDelete = async () => {
    await handleDelete.mutateAsync({
      id: integration?.id as string,
      type: integration?.type as string,
      connectionId: integration?.connectionId as string,
    });
    openDialogHandlers.close();
  };

  return (
    <div>
      {integration && (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-1.5 text-gray-400 data-[state=open]:bg-accent data-[state=open]:text-gray-900"
                disabled={disabled}
              >
                <IconDots size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[190px]">
              <DropdownMenuItem className="">
                <IconSettings className="mr-2 h-4 w-4" />
                <span>Manage integration</span>
              </DropdownMenuItem>
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
            title="integration"
            open={openDialog}
            onClose={openDialogHandlers.close}
            onDelete={onDelete}
            loading={handleDelete.isLoading}
          />
        </div>
      )}
    </div>
  );
}

export function GooleSheetActionsMenu({
  integration,
  disabled = false,
}: Props) {
  const constructGoogleSheetUrl = (spreadsheetId: string) => {
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  };

  const [openDialog, openDialogHandlers] = useDialog();

  const handleDelete = useIntegrationDeleteMutation(
    integration?.formId as string,
  );

  const onDelete = async () => {
    await handleDelete.mutateAsync({
      id: integration?.id as string,
      type: integration?.type as string,
      connectionId: integration?.connectionId as string,
    });
    openDialogHandlers.close();
  };

  return (
    <div>
      {integration && (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-1.5 text-gray-400 data-[state=open]:bg-accent data-[state=open]:text-gray-900"
              >
                <IconDots size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[190px]">
              <Link
                href={constructGoogleSheetUrl(
                  integration.spreadsheetId as string,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DropdownMenuItem className="">
                  <IconExternalLink className="mr-2 h-4 w-4" />
                  <span>Open Google Sheet</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="!text-red-500 hover:!bg-red-500/5"
                onClick={(e) => {
                  e.stopPropagation();
                  openDialogHandlers.open();
                }}
                disabled={disabled}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteDialog
            title="integration"
            open={openDialog}
            onClose={openDialogHandlers.close}
            onDelete={onDelete}
            loading={handleDelete.isLoading}
          />
        </div>
      )}
    </div>
  );
}
