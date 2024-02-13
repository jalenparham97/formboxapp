import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const UserSchema = z.object({
  name: z.string().min(3).max(32),
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
