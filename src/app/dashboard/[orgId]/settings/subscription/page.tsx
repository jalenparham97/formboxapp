import ManageSubscriptionButton from "@/components/subscription/manage-subscription-button";
import PricingSection from "@/components/subscription/pricing-section";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";

interface Props {
  params: { orgId: string };
}

export default async function SettingsSubscriptionPage({
  params: { orgId },
}: Props) {
  const org = await api.org.getById.query({ id: orgId });
  const products = await api.payment.getProducts.query();

  const currentPlan = org?.stripePlanNickname?.split("-")[0] ?? "Free";

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-lg font-semibold leading-7 text-gray-900">
          Subscription
        </h2>
        <p className="mt-1 leading-6 text-gray-600">
          View and edit your billing details, as well as cancel your
          subscription.
        </p>
        <p className="mt-3">
          Your current plan:{" "}
          <span className="font-semibold capitalize">{currentPlan}</span>
        </p>
        <div className="mt-5">
          <ManageSubscriptionButton orgId={orgId} />
        </div>
      </div>

      <div className="lg:max-w-7xl">
        <PricingSection products={products} org={org} />
      </div>

      <div>
        <h2 className="text-lg font-semibold leading-7 text-gray-900">
          Need anything else?
        </h2>
        <p className="mt-1 leading-6 text-gray-600">
          If you need any further help with billing, our support team are here
          to help.
        </p>
        <div className="mt-3">
          <Button variant="outline">Contact support</Button>
        </div>
      </div>
    </div>
  );
}
