import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const UserSchema = z.object({
  name: z
    .string()
    .min(3, "Name must contain at least 3 character(s)")
    .max(50, "Name must contain at less than 50 character(s)"),
});

export const OrgCreateSchema = z.object({
  name: z.string().min(1, "Organization name is a required field"),
  // slug: z.string().min(1, "Organization slug is a required field"),
});

export const OrgUpdateSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  slug: z.string().optional(),
});

const SortOperators = {
  ASC: "asc",
  DESC: "desc",
} as const;

export const filterSchema = {
  searchString: z.string().optional(),
  cursor: z.string().nullish(),
  sort: z.nativeEnum(SortOperators).optional(),
  take: z.number().optional(),
};
