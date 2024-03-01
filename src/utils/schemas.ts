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

export const formCreateSchema = z.object({
  name: z.string().min(1, "Form name is a required field."),
  orgId: z.string(),
});

export const formUpdateSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  isClosed: z.boolean().optional(),
  removeFormboxBranding: z.boolean().optional(),
  saveAnswers: z.boolean().optional(),
  sendEmailNotifications: z.boolean().optional(),
  sendRespondantEmailNotifications: z.boolean().optional(),
  limitResponses: z.boolean().optional(),
  maxResponses: z.number().optional().nullable(),
  respondantEmailFromName: z.string().optional(),
  respondantEmailSubject: z.string().optional(),
  respondantEmailMessageHTML: z.string().optional(),
  submitButtonText: z.string().optional(),
  webhookEnabled: z.boolean().optional(),
  webhookUrl: z.string().optional(),
  showCustomClosedMessage: z.boolean().optional(),
  closeMessageTitle: z.string().optional(),
  closeMessageDescription: z.string().optional(),
  headerTitle: z.string().optional(),
  headerDescription: z.string().optional(),
  pageMode: z.enum(["compact", "full"]).optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  buttonBackgroundColor: z.string().optional(),
  buttonTextColor: z.string().optional(),
  accentColor: z.string().optional(),
  buttonBorderStyle: z.enum(["full", "flat", "rounded"]).optional(),
  inputBorderStyle: z.enum(["full", "flat", "rounded"]).optional(),
  headerImage: z
    .object({
      url: z.string(),
      key: z.string().optional(),
    })
    .optional()
    .nullable(),
  logo: z
    .object({
      url: z.string(),
      key: z.string().optional(),
    })
    .optional()
    .nullable(),
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
