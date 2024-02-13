import type Stripe from "stripe";

import { env } from "@/env";
import { db } from "@/server/db";
import { stripe } from "@/libs/stripe";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error: any) {
    console.log(`❌ Error message: ${error.message}`);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const subscriptionId = session.subscription as string;

        const subscription = await stripe.subscriptions.update(subscriptionId, {
          metadata: { userId: session.metadata?.userId as string },
        });

        await db.user.update({
          where: {
            id: session?.metadata?.userId,
          },
          data: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeSubscriptionStatus: subscription.status,
            stripePlanNickname: subscription.items.data[0]?.plan.nickname,
            stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ),
          },
        });
      } else if (event.type === "customer.subscription.updated") {
        const subscription = event.data.object as Stripe.Subscription;

        // Update the price id and set the new period end.
        await db.user.update({
          where: {
            id: subscription.metadata?.userId as string,
          },
          data: {
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeSubscriptionStatus: subscription.status,
            stripePlanNickname: subscription.items.data[0]?.plan.nickname,
            stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ),
          },
        });
      } else if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;

        await db.user.update({
          where: {
            id: subscription.metadata?.userId as string,
          },
          data: {
            stripeSubscriptionStatus: subscription.status,
            stripePlanNickname: null,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ),
          },
        });
      } else {
        throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new Response(
        "Webhook handler failed. View your nextjs function logs.",
        {
          status: 400,
        },
      );
    }
  }
  return new Response(JSON.stringify({ received: true }));
}
