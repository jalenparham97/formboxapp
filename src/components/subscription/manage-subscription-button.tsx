"use client";

import { Button } from "@/components/ui/button";
import { useOrgById } from "@/queries/org.queries";
import { api } from "@/trpc/react";
import { IconExternalLink } from "@tabler/icons-react";

interface Props {
  orgId: string;
}

export default function ManageSubscriptionButton({ orgId }: Props) {
  const { data: org } = useOrgById(orgId);
  const portalMutation = api.payment.getBillingPortalSession.useMutation();

  const handleGetBillingPortal = async () => {
    const returnUrl = `${window.location.origin}/dashboard/${orgId}/settings/subscription`;
    const { url } = await portalMutation.mutateAsync({
      stripeCustomerId: org?.stripeCustomerId || "",
      returnUrl,
    });
    window?.location.assign(url);
  };

  return (
    <div>
      <Button
        onClick={handleGetBillingPortal}
        leftIcon={<IconExternalLink size={16} />}
        loading={portalMutation.isLoading}
        disabled={!org?.stripeSubscriptionId}
      >
        Billing portal
      </Button>
    </div>
  );
}
