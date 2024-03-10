"use client";

import { Button } from "@/components/ui/button";
import { submissionErrors } from "@/utils/constants";
import { cn } from "@/utils/tailwind-helpers";
import { IconArrowLeft, IconExclamationCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ErrorPage({ searchParams }: Props) {
  const error = searchParams?.error;
  const router = useRouter();

  function getErrorMessage() {
    if (error === submissionErrors.CLOSED) {
      return "The owner of this form has closed this form and it is no longer accepting submissions.";
    }

    if (error === submissionErrors.DOMAIN_NOT_ALLOWED) {
      return "The domain from which this submission was sent is not allowed.";
    }

    if (error === submissionErrors.FORM_NOT_FOUND) {
      return "The form you are trying to submit to does not exist.";
    }

    return "There was a problem processing your form submission.";
  }

  return (
    <div
      className={cn(
        "mt-40 flex h-full w-full flex-col items-center justify-center text-center md:mt-52",
      )}
    >
      <IconExclamationCircle size={60} className="mx-auto text-red-600" />
      <h2 className="mt-4 text-2xl font-semibold lg:text-3xl">Sorry!</h2>
      <p className="mt-4 font-light lg:text-xl">{getErrorMessage()}</p>
      <Button
        className="mt-8"
        variant="secondary"
        leftIcon={<IconArrowLeft size={16} />}
        onClick={() => router.back()}
      >
        Back to previous page
      </Button>
    </div>
  );
}
