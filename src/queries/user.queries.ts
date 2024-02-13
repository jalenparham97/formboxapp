import type { UserWithAccounts } from "@/types/user.types";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useUser = (initialData?: UserWithAccounts) => {
  const user = api.user.getUser.useQuery(undefined, {
    initialData,
    refetchOnMount: false,
  });
  return user.data;
};

export const useAuthUser = () => {
  const user = api.user.getUser.useQuery();
  return user.data;
};

export const useUserUpdateMutation = (
  options: { showToast: boolean } = { showToast: true },
) => {
  const apiUtils = api.useUtils();

  return api.user.updateUser.useMutation({
    onMutate: async () => {
      await apiUtils.user.getUser.cancel();
      const previousQueryData = apiUtils.user.getUser.getData();
      return { previousQueryData };
    },
    onSuccess: () => {
      options.showToast &&
        toast.success("Account updated", {
          description: "Your account has been successfully updated!",
          closeButton: true,
        });
    },
    onError: (error, _, ctx) => {
      console.log(error);
      apiUtils.user.getUser.setData(void {}, ctx?.previousQueryData);
      toast.error("Something went wrong!", {
        description: "An error occured while trying to update your profile.",
        closeButton: true,
      });
    },
    onSettled: async () => {
      await apiUtils.user.getUser.invalidate();
    },
  });
};
