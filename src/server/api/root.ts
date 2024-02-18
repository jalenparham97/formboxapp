import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user.router";
import { storageRouter } from "./routers/storage.router";
import { paymentRouter } from "./routers/payment.router";
import { workspacesRouter } from "./routers/workspace.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  storage: storageRouter,
  payment: paymentRouter,
  workspace: workspacesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
