import { type RouterInputs, type RouterOutputs } from "@/trpc/shared";
import type { formCreateSchema, formUpdateSchema } from "@/utils/schemas";
import type { InfiniteData } from "@tanstack/react-query";
import type { z } from "zod";

export type FormCreateFields = z.infer<typeof formCreateSchema>;
export type FormUpdateFields = z.infer<typeof formUpdateSchema>;

export type FormCreateData = RouterInputs["form"]["create"];
export type FormUpdateData = RouterInputs["form"]["updateById"];

export type FormsOutput = RouterOutputs["form"]["getAll"];
export type FormOutput = RouterOutputs["form"]["getById"];

export type FormFindInput = RouterInputs["form"]["getAll"];

export type InfiniteFormsData = InfiniteData<FormsOutput> | undefined;
