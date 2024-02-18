import { useLocalStorage } from "@/hooks/use-local-storage";
import { api } from "@/trpc/react";
import type { OrgFindInput, OrgsOutput } from "@/types/org.types";
import { useRouter } from "next/navigation";
import { isEmpty } from "radash";
import { toast } from "sonner";

export const useOrgs = () => {
  return api.org.getAll.useQuery({ take: 500 });
};

export const useOrgMembers = (orgId: string) => {
  return api.org.getMembers.useQuery({ id: orgId });
};

export const useOrgInvites = (orgId: string) => {
  return api.org.getInvites.useQuery({ id: orgId });
};

export const useInfiniteOrgs = (
  input?: OrgFindInput,
  initialData?: OrgsOutput,
) => {
  return api.org.getAll.useInfiniteQuery(
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

export const useOrgById = (id: string) => {
  return api.org.getById.useQuery({ id }, { enabled: !isEmpty(id) });
};

export const useOrgAddMutation = () => {
  const router = useRouter();
  const apiUtils = api.useUtils();
  const localStorage = useLocalStorage();

  return api.org.create.useMutation({
    onMutate: async () => {
      await apiUtils.org.getAll.cancel();
      const previousQueryData = apiUtils.org.getAll.getInfiniteData();
      return { previousQueryData };
    },
    onSuccess: async (data) => {
      localStorage?.setItem("recent-org-slug", data.slug || "");
      router.push(`/${data.slug}`);
    },
    onError: (error, _, ctx) => {
      console.log(error);
      apiUtils.org.getAll.setInfiniteData({}, ctx?.previousQueryData);
    },
    onSettled: async () => {
      await apiUtils.org.getAll.invalidate();
    },
  });
};

// export const useWorkspaceUpdateMutation = (id: string) => {
//   const apiUtils = api.useUtils();

//   return api.workspace.updateById.useMutation({
//     onMutate: async () => {
//       await apiUtils.workspace.getById.cancel({ id });
//       const previousQueryData = apiUtils.workspace.getById.getData({
//         id,
//       });
//       return { previousQueryData };
//     },
//     onSuccess: () => {
//       toast.success("Workspace updated", {
//         description: "Your workspace has been successfully updated!",
//       });
//     },
//     onError: (error, _, ctx) => {
//       console.log(error);
//       apiUtils.workspace.getById.setData({ id }, ctx?.previousQueryData);
//       toast.error("Error", { description: error.message });
//     },
//     onSettled: async () => {
//       await apiUtils.workspace.getById.invalidate({ id });
//       await apiUtils.workspace.getAll.invalidate();
//     },
//   });
// };
