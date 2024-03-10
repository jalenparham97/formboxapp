"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/tailwind-helpers";
import { IconArrowLeft, IconCircleCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div
      className={cn(
        "mt-40 flex h-full w-full flex-col items-center justify-center text-center md:mt-52",
      )}
    >
      <IconCircleCheck size={60} className="mx-auto" />
      <h2 className="mt-4 text-2xl font-semibold lg:text-3xl">Thank You!</h2>
      <p className="mt-4 font-light lg:text-xl">
        The form was submitted successfully.
      </p>
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
