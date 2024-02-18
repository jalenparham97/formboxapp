import { api } from "@/trpc/react";
import {
  type WorkspaceFindInput,
  type WorkspacesOutput,
} from "@/types/workspace.types";
import { useRouter } from "next/navigation";
import { isEmpty } from "radash";
import { toast } from "sonner";

export const useWorkspaces = () => {
  return api.workspace.getAll.useQuery({ take: 500 });
};

export const useWorkspaceMembers = (workspaceId: string) => {
  return api.workspace.getMembers.useQuery({ id: workspaceId });
};

export const useWorkspaceInvites = (workspaceId: string) => {
  return api.workspace.getInvites.useQuery({ id: workspaceId });
};

export const useInfiniteWorkspaces = (
  input?: WorkspaceFindInput,
  initialData?: WorkspacesOutput,
) => {
  return api.workspace.getAll.useInfiniteQuery(
    { ...input },
    {
      initialData: () => {
        if (initialData) {
          return {
            pageParams: [undefined],
            pages: [initialData],
          };
        }
      },
      getNextPageParam: (lastPage) => lastPage.cursor || undefined,
    },
  );
};

export const useWorkspaceById = (id: string) => {
  return api.workspace.getById.useQuery({ id }, { enabled: !isEmpty(id) });
};

export const useWorkspaceAddMutation = () => {
  const router = useRouter();
  const apiUtils = api.useUtils();

  return api.workspace.createWorkspace.useMutation({
    onMutate: async () => {
      await apiUtils.workspace.getAll.cancel();
      const previousQueryData = apiUtils.workspace.getAll.getInfiniteData();
      return { previousQueryData };
    },
    onSuccess: async (data) => {
      router.push(`/workspaces/${data.id}`);
    },
    onError: (error, _, ctx) => {
      console.log(error);
      apiUtils.workspace.getAll.setInfiniteData({}, ctx?.previousQueryData);
    },
    onSettled: async () => {
      await apiUtils.workspace.getAll.invalidate();
    },
  });
};

export const useCreateWorkspaceInviteMutation = () => {
  const apiUtils = api.useUtils();
  const router = useRouter();

  return api.workspace.createInvite.useMutation({
    onSuccess: async (data, input) => {
      router.push(`/workspaces/${input.workspaceId}/members?tab=invites`);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error", { description: error.message });
    },
    onSettled: async (data, _, input) => {
      apiUtils.workspace.getInvites.invalidate({ id: input.workspaceId });
    },
  });
};

export const useWorkspaceUpdateMutation = (id: string) => {
  const apiUtils = api.useUtils();

  return api.workspace.updateById.useMutation({
    onMutate: async () => {
      await apiUtils.workspace.getById.cancel({ id });
      const previousQueryData = apiUtils.workspace.getById.getData({
        id,
      });
      return { previousQueryData };
    },
    onSuccess: () => {
      toast.success("Workspace updated", {
        description: "Your workspace has been successfully updated!",
      });
    },
    onError: (error, _, ctx) => {
      console.log(error);
      apiUtils.workspace.getById.setData({ id }, ctx?.previousQueryData);
      toast.error("Error", { description: error.message });
    },
    onSettled: async () => {
      await apiUtils.workspace.getById.invalidate({ id });
      await apiUtils.workspace.getAll.invalidate();
    },
  });
};

export const useWorkspaceDeleteMutation = () => {
  const apiUtils = api.useUtils();

  return api.workspace.deleteById.useMutation({
    onMutate: async () => {
      await apiUtils.workspace.getAll.cancel();
      const previousQueryData = apiUtils.workspace.getAll.getInfiniteData();
      return { previousQueryData };
    },
    onError: (error, _, ctx) => {
      console.log(error);
      apiUtils.workspace.getAll.setInfiniteData({}, ctx?.previousQueryData);
      toast.error("Error", { description: error.message });
    },
    onSettled: async () => {
      await apiUtils.workspace.getAll.invalidate();
    },
  });
};

export const useWorkspaceMemberDeleteMutation = (workspaceId: string) => {
  const apiUtils = api.useUtils();

  return api.workspace.deleteMember.useMutation({
    onMutate: async () => {
      await apiUtils.workspace.getMembers.cancel({ id: workspaceId });
      const previousQueryData = apiUtils.workspace.getMembers.getData({
        id: workspaceId,
      });
      return { previousQueryData };
    },
    onError: (error, _, ctx) => {
      console.log(error);
      apiUtils.workspace.getMembers.setData(
        { id: workspaceId },
        ctx?.previousQueryData,
      );
      toast.error("Error", { description: error.message });
    },
    onSettled: async () => {
      await apiUtils.workspace.getMembers.invalidate({ id: workspaceId });
    },
  });
};
