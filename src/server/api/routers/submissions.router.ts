import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { filterSchema } from "@/utils/schemas";
import { FILTER_TAKE } from "@/utils/constants";

export const submissionsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
        ...filterSchema,
        isSpam: z.boolean().default(false).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const formQuery = { formId: input.formId };

      console.log("take: ", input.take);

      const take = input?.take ?? FILTER_TAKE;

      const data = await ctx.db.submission.findMany({
        where: {
          ...formQuery,
          isSpam: input.isSpam,
          answers: {
            some: {
              value: {
                contains: input.searchString,
                mode: "insensitive",
              },
            },
          },
        },
        include: {
          form: true,
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

      const total = await ctx.db.submission.count({
        where: formQuery,
      });

      console.log("total: ", data.length);

      const result = { total, data, cursor: "" };

      if (data.length < take) return result;

      return { ...result, cursor: data.at(-1)?.id };
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.submission.delete({ where: { id: input.id } });
    }),
});
