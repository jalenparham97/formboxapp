import { type z } from "zod";
import { type LoginSchema } from "@/utils/validations/auth.validations";

export type LoginCreds = z.infer<typeof LoginSchema>;
