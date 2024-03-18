import { api } from "@/trpc/react";
import {
  type IntegrationFindInput,
  type IntegrationsOutput,
} from "@/types/integration.types";
import { isEmpty } from "radash";
import { toast } from "sonner";

type QueryOptions = {
  refetchOnWindowFocus?: boolean;
};

export const useIntegrations = (formId: string) => {
  return api.integration.getAll.useQuery({ formId, take: 500 });
};

export const useInfiniteIntegrations = (
  input: IntegrationFindInput,
  initialData?: IntegrationsOutput,
) => {
  return api.integration.getAll.useInfiniteQuery(
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

export const useIntegrationById = (
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

export const useIntegrationAddMutation = () => {
  const apiUtils = api.useUtils();

  return api.integration.create.useMutation({
    onMutate: async (input) => {
      await apiUtils.integration.getAll.cancel();
      const previousQueryData = apiUtils.integration.getAll.getInfiniteData({
        formId: input.formId,
      });
      return { previousQueryData };
    },
    onError: (error, input, ctx) => {
      console.log(error);
      apiUtils.integration.getAll.setInfiniteData(
        { formId: input.formId },
        ctx?.previousQueryData,
      );
      toast.error("Error", { description: error.message });
    },
    onSettled: async (_, _error, input) => {
      await apiUtils.integration.getAll.invalidate({ formId: input.formId });
    },
  });
};

export const useIntegrationUpdateMutation = () => {
  const apiUtils = api.useUtils();

  return api.integration.updateById.useMutation({
    onMutate: async (input) => {
      await apiUtils.integration.getById.cancel({ id: input.id });
      const previousQueryData = apiUtils.integration.getById.getData({
        id: input.id,
      });
      return { previousQueryData };
    },
    onError: (error, input, ctx) => {
      console.log(error);
      apiUtils.integration.getById.setData(
        { id: input.id },
        ctx?.previousQueryData,
      );
      toast.error("Error", { description: error.message });
    },
    onSettled: async (data, error, input) => {
      await apiUtils.integration.getById.invalidate({ id: input.id });
      await apiUtils.integration.getAll.invalidate();
    },
  });
};

export const useIntegrationDeleteMutation = (formId: string) => {
  const apiUtils = api.useUtils();

  return api.integration.deleteById.useMutation({
    onMutate: async () => {
      await apiUtils.integration.getAll.cancel();
      const previousQueryData = apiUtils.integration.getAll.getInfiniteData();
      return { previousQueryData };
    },
    onError: (error, input, ctx) => {
      console.log(error);
      apiUtils.integration.getAll.setInfiniteData(
        { formId },
        ctx?.previousQueryData,
      );
      toast.error("Error", { description: error.message });
    },
    onSettled: async () => {
      await apiUtils.integration.getAll.invalidate();
    },
  });
};
