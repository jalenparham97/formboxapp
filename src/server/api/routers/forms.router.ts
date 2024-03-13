import { FILTER_TAKE } from "@/utils/constants";
import { omit } from "radash";
import { z } from "zod";
import {
  formCreateSchema,
  formUpdateSchema,
  filterSchema,
} from "@/utils/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const formsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(formCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.form.create({
        data: { ...input, emailsToNotify: [ctx.user.email as string] },
      });
    }),
  getAll: protectedProcedure
    .input(z.object({ orgId: z.string(), ...filterSchema }))
    .query(async ({ ctx, input }) => {
      const orgQuery = { orgId: input.orgId };

      const take = input?.take ?? FILTER_TAKE;

      const data = await ctx.db.form.findMany({
        cacheStrategy: { swr: 60 },
        where: {
          ...orgQuery,
          name: {
            contains: input?.searchString,
            mode: "insensitive",
          },
        },
        include: {
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

      const total = await ctx.db.form.count({
        where: orgQuery,
      });

      const result = { total, data, cursor: "" };

      if (data.length < take) return result;

      return { ...result, cursor: data.at(-1)?.id };
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.form.findUnique({
        cacheStrategy: { swr: 60 },
        where: { id: input.id },
        include: {
          _count: {
            select: { submissions: true },
          },
        },
      });
    }),
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
});
