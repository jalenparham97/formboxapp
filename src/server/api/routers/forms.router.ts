import { FILTER_TAKE } from "@/utils/constants";
import { omit } from "radash";
import { z } from "zod";
import {
  formCreateSchema,
  formUpdateSchema,
  filterSchema,
} from "@/utils/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";

function getSubmissionDuration(plan: string) {
  switch (plan) {
    case "free":
      return "60";
    case "starter":
      return "90";
    case "professional":
      return "365";
    case "business":
      return "forever";
    default:
      return "60";
  }
}

export const formsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(formCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.db.org.findUnique({ where: { id: input.orgId } });
      const duration = getSubmissionDuration(org?.stripePlan ?? "free");
      return ctx.db.form.create({
        data: {
          ...input,
          emailsToNotify: [ctx.user.email as string],
          submissionStorageDuration: duration,
        },
      });
    }),
  getAll: protectedProcedure
    .input(z.object({ orgId: z.string(), ...filterSchema }))
    .query(async ({ ctx, input }) => {
      const orgQuery = { orgId: input.orgId };

      const take = input?.take ?? FILTER_TAKE;

      const data = await ctx.db.form.findMany({
        where: {
          ...orgQuery,
          name: {
            contains: input?.searchString,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          isClosed: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { submissions: true },
          },
        },
        ...(input.cursor && {
          cursor: {
            id: input.cursor,
          },
          skip: 1,
        }),
        take,
        orderBy: { createdAt: "desc" },
      });

      const result = { data, cursor: "" };

      if (data.length < take) return result;

      return { ...result, cursor: data.at(-1)?.id };
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.form.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: { submissions: true },
          },
        },
      });
    }),
  // getAllExportSubmissions: protectedProcedure
  //   .input(
  //     z.object({
  //       formId: z.string(),
  //       ...filterSchema,
  //     }),
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const data = await ctx.db.formEndpointSubmission.findMany({
  //       where: { formId: input.formId },
  //     });

  //     let fields: Record<string, string> = {};

  //     return data.map((submission) => {
  //       submission.fields.map((field) => {
  //         fields[field.label] = field.value;
  //       });

  //       return {
  //         ...fields,
  //         isSpam: submission.isSpam,
  //       };
  //     });
  //   }),
  // getRecentSubmissions: protectedProcedure.query(async ({ ctx }) => {
  //   return await ctx.db.formEndpointSubmission.findMany({
  //     where: {
  //       form: {
  //         workspace: {
  //           members: {
  //             some: {
  //               userId: ctx.user.id,
  //             },
  //           },
  //         },
  //       },
  //     },
  //     take: 5,
  //     orderBy: {
  //       createdAt: "desc",
  //     },
  //   });
  // }),
  updateById: protectedProcedure
    .input(formUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.form.update({
        where: { id: input.id },
        data: omit(input, ["id"]),
      });
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.form.delete({ where: { id: input.id } });
    }),
  // updateSubmission: protectedProcedure
  //   .input(
  //     z.object({ submissionId: z.string(), isSpam: z.boolean().optional() }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     return await ctx.db.formEndpointSubmission.update({
  //       where: { id: input.submissionId },
  //       data: { isSpam: input.isSpam },
  //     });
  //   }),
  // deleteSubmission: protectedProcedure
  //   .input(z.object({ submissionId: z.string(), formId: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     return await ctx.db.formEndpointSubmission.delete({
  //       where: { id: input.submissionId },
  //     });
  //   }),
});
