"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { type OrgCreateFields } from "@/types/org.types";
import { OrgCreateSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useOrgAddMutation } from "@/queries/org.queries";
import { dash } from "radash";
import { useDebounce } from "@/hooks/use-debounce";
import { nanoid } from "@/libs/nanoid";

export function OnboardingOrgCreateForm() {
  const router = useRouter();
  // const [data, setData] = useState<OrgCreateFields>({ name: "", slug: "" });
  // const [slugError, setSlugError] = useState<string | null>(null);

  // const { name, slug } = data;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrgCreateFields>({ resolver: zodResolver(OrgCreateSchema) });

  // const debouncedSlug = useDebounce(slug, 500);

  // useEffect(() => {
  //   if (debouncedSlug.length > 0 && !slugError) {
  //   }
  // }, [debouncedSlug, slugError]);

  const orgCreateMutation = useOrgAddMutation();

  const onSubmit = async (data: OrgCreateFields) => {
    await orgCreateMutation.mutateAsync({ name: data.name, slug: nanoid(12) });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            label="Organization name"
            {...register("name")}
            error={errors.name !== undefined}
            errorMessage={errors?.name?.message}
            allowAutoComplete={false}
          />
        </div>

        <div className="mt-10">
          <Button
            type="submit"
            loading={orgCreateMutation.isLoading}
            className="w-full"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
