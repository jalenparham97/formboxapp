import { api } from "@/trpc/react";
import { toast } from "sonner";

export function useFileUploadUrlMutation() {
  return api.storage.getUploadUrl.useMutation({
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong!", {
        description:
          "An error occured while trying to update your profile picture.",
        closeButton: true,
      });
    },
  });
}

export function useFileDeleteMutation() {
  return api.storage.deleteFile.useMutation({
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong!", {
        description:
          "An error occured while trying to update your profile picture.",
        closeButton: true,
      });
    },
  });
}
