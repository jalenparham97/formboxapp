import { FILTER_TAKE } from "@/utils/constants";
import { omit } from "radash";
import { z } from "zod";
import {
  filterSchema,
  integrationCreateSchema,
  integrationUpdateSchema,
} from "@/utils/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { nango } from "@/libs/nango/server";
import { createGoogleSheet } from "@/libs/nango/integrations/google-sheets";

export const integrationsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(integrationCreateSchema)
    .mutation(async ({ ctx, input }) => {
      let googleSheetResult;

      if (input.type === "google-sheets") {
        const form = await ctx.db.form.findUnique({
          where: { id: input.formId },
          select: { name: true },
        });
        googleSheetResult = await createGoogleSheet(
          input.connectionId,
          form?.name,
        );
      }
      return ctx.db.integration.create({
        data: {
          ...input,
          spreadsheetId: googleSheetResult?.data.spreadsheetId,
        },
      });
    }),
  getAll: protectedProcedure
    .input(z.object({ formId: z.string(), ...filterSchema }))
    .query(async ({ ctx, input }) => {
      const formQuery = { formId: input.formId };

      const take = input?.take ?? FILTER_TAKE;

      const data = await ctx.db.integration.findMany({
        where: {
          ...formQuery,
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

      const total = await ctx.db.integration.count({
        where: formQuery,
      });

      const result = { total, data, cursor: "" };

      if (data.length < take) return result;

      return { ...result, cursor: data.at(-1)?.id };
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.integration.findUnique({
        where: { id: input.id },
      });
    }),
  updateById: protectedProcedure
    .input(integrationUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.integration.update({
        where: { id: input.id },
        data: omit(input, ["id"]),
      });
    }),
  deleteById: protectedProcedure
    .input(
      z.object({ id: z.string(), connectionId: z.string(), type: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      await nango.deleteConnection(input.type, input.connectionId);
      return await ctx.db.integration.delete({ where: { id: input.id } });
    }),
});
