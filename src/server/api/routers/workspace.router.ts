import { WorkspaceRoles } from "@/types/workspace.types";
import { FILTER_TAKE } from "@/utils/constants";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { filterSchema } from "@/utils/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { randomBytes } from "crypto";
import { env } from "@/env";
import { sendWorkspaceInviteEmail } from "@/libs/mail";
import { hashToken } from "@/utils/hash-token";

export const workspacesRouter = createTRPCRouter({
  createWorkspace: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        orgId: z.string(),
        userId: z.string(),
        isPrivate: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.workspace.create({
        data: {
          ...input,
          members: {
            create: {
              userId: input.userId,
              orgId: input.orgId,
              role: WorkspaceRoles.MEMBER,
            },
          },
        },
      });
    }),
  getAll: protectedProcedure
    .input(z.object({ ...filterSchema }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const take = input?.take || FILTER_TAKE;

      const data = await ctx.db.workspace.findMany({
        where: {
          name: {
            contains: input?.searchString,
            mode: "insensitive",
          },
          members: {
            some: {
              userId,
            },
          },
        },
        include: {
          // user: {
          //   select: {
          //     stripePlanNickname: true,
          //   },
          // },
          // _count: {
          //   select: {
          //     forms: true,
          //   },
          // },
          _count: {
            select: {
              members: true,
            },
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

      const total = await ctx.db.workspace.count({
        where: {
          members: {
            some: {
              userId,
            },
          },
        },
      });

      const result = { total, data, cursor: "" };

      if (data.length < take) return result;

      return { ...result, cursor: data.at(-1)?.id || "" };
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workspace = await ctx.db.workspace.findFirst({
        where: { id: input.id },
        include: {
          members: {
            where: {
              userId: ctx.user.id,
            },
          },
        },
      });

      const workspaceOwner = await ctx.db.user.findUnique({
        where: { id: workspace?.userId },
      });

      const workspaceOwnerPlan = workspaceOwner?.stripePlanNickname;

      if (workspace) {
        // project exists but user is not part of it
        if (workspace.members.length === 0) {
          const pendingInvites = await ctx.db.workspaceInvite.findUnique({
            where: {
              email_workspaceId: {
                email: ctx.user.email as string,
                workspaceId: workspace.id,
              },
            },
            select: {
              expires: true,
            },
          });
          if (!pendingInvites) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Workspace not found",
            });
          } else if (pendingInvites.expires < new Date()) {
            throw new TRPCError({
              code: "CLIENT_CLOSED_REQUEST",
              message: "Workspace invite expired",
            });
          } else {
            throw new TRPCError({
              code: "CONFLICT",
              message: `Workspace invite pending - ${workspace.name}`,
            });
          }
        }
      } else {
        // workspace doesn't exist
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace not found",
        });
      }

      return { ...workspace, workspaceOwnerPlan };
    }),
  updateById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.workspace.update({
        where: { id: input.id },
        data: { name: input.name },
        include: {
          members: {
            where: {
              userId: ctx.user.id,
            },
          },
        },
      });
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.workspace.delete({
        where: { id: input.id },
      });
    }),
  getMembers: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.workspaceMember.findMany({
        where: { workspaceId: input.id },
        select: {
          id: true,
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          workspace: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
        },
      });
    }),
  deleteMember: protectedProcedure
    .input(z.object({ memberId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.workspaceMember.delete({
        where: { id: input.memberId },
      });
    }),
  getInvites: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.workspaceInvite.findMany({
        where: { workspaceId: input.id },
      });
    }),
  createInvite: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        workspaceId: z.string(),
        workspaceName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email, workspaceId, workspaceName } = input;

      const alreadyInTeam = await ctx.db.workspaceMember.findFirst({
        where: {
          workspaceId,
          user: {
            email,
          },
        },
      });

      if (alreadyInTeam) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists in this workspace",
        });
      }

      // same method of generating a token as next-auth
      const token = randomBytes(32).toString("hex");
      const ONE_WEEK_IN_SECONDS = 604800;
      const expires = new Date(Date.now() + ONE_WEEK_IN_SECONDS * 1000);

      // create a workspace invite record and a verification request token that lasts for a week
      // here we use a try catch to account for the case where the user has already been invited
      // for which `prisma.workspaceInvite.create()` will throw a unique constraint error
      try {
        await ctx.db.workspaceInvite.create({
          data: {
            email,
            expires,
            workspaceId,
          },
        });

        await ctx.db.verificationToken.create({
          data: {
            identifier: email,
            token: hashToken(token),
            expires,
          },
        });

        const params = new URLSearchParams({
          callbackUrl: `${env.NEXTAUTH_URL}/workspaces/${workspaceId}`,
          token,
          email,
        });

        const link = `${env.NEXTAUTH_URL}/api/auth/callback/email?${params}`;

        const mail = await sendWorkspaceInviteEmail(email, workspaceName, link);

        if (mail.error) {
          throw new TRPCError({
            code: "PARSE_ERROR",
            message: mail.error.message,
            cause: mail.error.name,
          });
        }

        return { sent: true };
      } catch (error) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already invited",
          cause: error,
        });
      }
    }),
  acceptInvite: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.db.workspaceInvite.findFirst({
        where: {
          email: ctx.user.email as string,
          workspaceId: input.workspaceId,
        },
        select: {
          expires: true,
          workspaceId: true,
        },
      });

      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid invitation",
        });
      } else if (invite.expires < new Date()) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Invitation expired",
        });
      } else {
        const response = await Promise.all([
          ctx.db.workspaceMember.create({
            data: {
              userId: ctx.user.id,
              role: WorkspaceRoles.MEMBER,
              workspaceId: invite.workspaceId,
            },
          }),
          ctx.db.workspaceInvite.delete({
            where: {
              email_workspaceId: {
                email: ctx.user.email as string,
                workspaceId: invite.workspaceId,
              },
            },
          }),
        ]);
        return response;
      }
    }),
  deleteInvite: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.workspaceInvite.delete({
        where: { id: input.id },
      });
    }),
});
