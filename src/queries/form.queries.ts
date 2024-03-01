import { api } from "@/trpc/react";
import type { FormFindInput, FormsOutput } from "@/types/form.types";
import { useRouter } from "next/navigation";
import { isEmpty } from "radash";
import { toast } from "sonner";

type QueryOptions = {
  refetchOnWindowFocus?: boolean;
};

export const useForms = (orgId: string) => {
  return api.form.getAll.useQuery({ orgId, take: 500 });
};

export const useInfiniteForms = (
  input: FormFindInput,
  initialData?: FormsOutput,
) => {
  return api.form.getAll.useInfiniteQuery(
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

export const useFormById = (
  id: string,
  options: QueryOptions = { refetchOnWindowFocus: true },
) => {
  return api.form.getById.useQuery(
    { id },
    {
      enabled: !isEmpty(id),
      refetchOnWindowFocus: options.refetchOnWindowFocus,
    },
  );
};

export const useFormAddMutation = () => {
  const router = useRouter();
  const apiUtils = api.useUtils();

  return api.form.create.useMutation({
    onMutate: async () => {
      await apiUtils.form.getAll.cancel();
      const previousQueryData = apiUtils.form.getAll.getInfiniteData();
      return { previousQueryData };
    },
    onSuccess: async (data) => {
      router.push(`/editor/${data.id}/create`);
    },
    onError: (error, input, ctx) => {
      console.log(error);
      apiUtils.form.getAll.setInfiniteData(
        { orgId: input.orgId },
        ctx?.previousQueryData,
      );
    },
    onSettled: async () => {
      await apiUtils.form.getAll.invalidate();
    },
  });
};

export const useFormUpdateMutation = () => {
  const apiUtils = api.useUtils();

  return api.form.updateById.useMutation({
    onMutate: async (input) => {
      await apiUtils.form.getById.cancel({ id: input.id });
      const previousQueryData = apiUtils.form.getById.getData({
        id: input.id,
      });
      return { previousQueryData };
    },
    onSuccess: () => {
      toast.success("Form settings updated");
    },
    onError: (error, input, ctx) => {
      console.log(error);
      apiUtils.form.getById.setData({ id: input.id }, ctx?.previousQueryData);
      toast.error("Error", { description: error.message });
    },
    onSettled: async (data, error, input) => {
      await apiUtils.form.getById.invalidate({ id: input.id });
      await apiUtils.form.getAll.invalidate();
    },
  });
};

export const useFormDeleteMutation = (orgId: string) => {
  const apiUtils = api.useUtils();

  return api.form.deleteById.useMutation({
    onMutate: async () => {
      await apiUtils.form.getAll.cancel();
      const previousQueryData = apiUtils.form.getAll.getInfiniteData();
      return { previousQueryData };
    },
    onError: (error, input, ctx) => {
      console.log(error);
      apiUtils.form.getAll.setInfiniteData({ orgId }, ctx?.previousQueryData);
      toast.error("Error", { description: error.message });
    },
    onSettled: async () => {
      await apiUtils.form.getAll.invalidate();
    },
  });
};
