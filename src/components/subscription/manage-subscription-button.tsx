"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import type { UserWithAccounts } from "@/types/user.types";
import { IconExternalLink } from "@tabler/icons-react";

interface Props {
  user: UserWithAccounts;
}

export default function ManageSubscriptionButton({ user }: Props) {
  const portalMutation = api.payment.getBillingPortalSession.useMutation();

  const handleGetBillingPortal = async () => {
    const { url } = await portalMutation.mutateAsync({
      stripeCustomerId: user?.stripeCustomerId || "",
      returnUrl: window.location.origin,
    });
    window?.location.assign(url);
  };

  return (
    <div>
      <Button
        onClick={handleGetBillingPortal}
        leftIcon={<IconExternalLink size={16} />}
        loading={portalMutation.isLoading}
        disabled={!user?.stripeSubscriptionId}
      >
        Billing portal
      </Button>
    </div>
  );
}
