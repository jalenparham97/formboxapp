import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user.router";
import { storageRouter } from "./routers/storage.router";
import { paymentRouter } from "./routers/payment.router";
import { orgRouter } from "./routers/org.router";
import { formsRouter } from "./routers/forms.router";
import { submissionsRouter } from "./routers/submissions.router";
import { integrationsRouter } from "./routers/integrations.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  storage: storageRouter,
  payment: paymentRouter,
  org: orgRouter,
  form: formsRouter,
  submission: submissionsRouter,
  integration: integrationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
