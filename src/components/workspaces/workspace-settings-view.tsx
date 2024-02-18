"use client";

import { useDialog } from "@/hooks/use-dialog";
import {
  useInfiniteWorkspaces,
  useWorkspaceById,
  useWorkspaceDeleteMutation,
  useWorkspaceUpdateMutation,
} from "@/queries/workspace.queries";
import { api } from "@/trpc/react";
import {
  type WorkspacesOutput,
  type WorkspaceUpdateData,
} from "@/types/workspace.types";
import { formatWorkspaces } from "@/utils/format-workspaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { isEmpty } from "radash";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Divider } from "../ui/divider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { IconTrash } from "@tabler/icons-react";
import { WorkspaceDeleteDialog } from "./workspace-delete-dialog";

const schema = z.object({
  name: z.string({ required_error: "Workspace name is a required field." }),
});

interface Props {
  workspaceId: string;
}

export function WorkspaceSettingsView({ workspaceId }: Props) {
  const router = useRouter();
  const apiUtils = api.useUtils();
  const [deleteModal, deleteModalHandler] = useDialog();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WorkspaceUpdateData>({ resolver: zodResolver(schema) });

  const { data: workspace, isLoading } = useWorkspaceById(workspaceId);
  const {
    data: workspaces,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteWorkspaces();

  const handleWorkspaceUpdate = useWorkspaceUpdateMutation(workspaceId);
  const handleWorkspaceDelete = useWorkspaceDeleteMutation();

  const data = useMemo(() => formatWorkspaces(workspaces), [workspaces]);

  const getNextWorkspaceId = (id: string, data: WorkspacesOutput["data"]) => {
    const currentWorkspaceIndex = data.findIndex((space) => space.id === id);
    return data[currentWorkspaceIndex + 1]?.id || "";
  };

  const getPrevWorkspaceId = (id: string, data: WorkspacesOutput["data"]) => {
    if (!isEmpty(data)) {
      const currentWorkspaceIndex = data.findIndex((space) => space.id === id);
      return data[currentWorkspaceIndex - 1]?.id || "";
    }
    return "";
  };

  const onSubmit = async (data: WorkspaceUpdateData) => {
    try {
      const workspaceName = data?.name ? data.name : workspace?.name || "";
      await handleWorkspaceUpdate.mutateAsync({
        id: workspaceId,
        name: workspaceName,
      });
      await apiUtils.workspace.getAll.invalidate();
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async () => {
    let nextId: string;
    try {
      await handleWorkspaceDelete.mutateAsync({ id: workspaceId });
      await apiUtils.workspace.getAll.invalidate();
      nextId = getNextWorkspaceId(workspaceId, data);

      if (!nextId && hasNextPage) {
        const result = await fetchNextPage();
        const newData = formatWorkspaces(result.data);
        nextId = getNextWorkspaceId(workspaceId, newData);
        router.push(`/workspaces/${nextId}`);
      } else {
        if (nextId) {
          router.push(`/workspaces/${nextId}`);
          return;
        }

        if (data.length === 1) {
          router.push("/");
          return;
        }

        nextId = getPrevWorkspaceId(workspaceId, data);
        router.push(`/workspaces/${nextId}`);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <div>
          <h3 className="text-xl font-semibold">Settings</h3>
          <p className="mt-2 text-gray-600">Manage your workspace settings.</p>
        </div>

        <div className="mt-7">
          <form className="w-full sm:max-w-xl">
            <div className="space-y-3">
              <Input
                label="Workspace name"
                className=""
                defaultValue={workspace?.name as string}
                {...register("name")}
                error={errors?.name !== undefined}
                errorMessage={errors?.name && errors?.name?.message}
                allowAutoComplete={false}
              />
            </div>

            <Button
              className="mt-7"
              loading={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              Update
            </Button>
          </form>
        </div>

        <Divider className="mt-8" />

        <div className="mt-8">
          <h3 className="text-lg font-semibold">Danger zone</h3>
          <p className="mt-3.5 max-w-lg text-gray-600">
            Are you sure you want to delete this workspace? If you want to
            delete your workspace, you will loose all of your forms and
            submissions you have collected. This action is irreversible.
          </p>
          <Button
            variant="outline"
            className="mt-5"
            leftIcon={<IconTrash size={16} className="text-red-600" />}
            onClick={deleteModalHandler.open}
          >
            Delete workspace
          </Button>
        </div>
      </div>

      <WorkspaceDeleteDialog
        title={workspace?.name}
        open={deleteModal}
        onClose={deleteModalHandler.close}
        loading={handleWorkspaceDelete.isLoading}
        onDelete={onDelete}
      />
    </div>
  );
}
