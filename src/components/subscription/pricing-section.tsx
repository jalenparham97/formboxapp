"use client";

import {
  SegmentedControls,
  SegmentedControlsList,
  SegmentedControlsTrigger,
} from "@/components/ui/segmented-controls";
import type { Products } from "@/types/payment.types";
import type { UserWithAccounts } from "@/types/user.types";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format-currency";
import { api } from "@/trpc/react";

type PriceFrequency = "month" | "year";

interface Props {
  products: Products;
  user: UserWithAccounts;
}

export default function PricingSection({ products, user }: Props) {
  const [frequency, setFrequency] = useState<PriceFrequency>("month");

  const sessionMutation = api.payment.getCheckoutSession.useMutation();
  const portalMutation = api.payment.getBillingPortalSession.useMutation();

  const handleUpgrade = async (priceId: string = "") => {
    if (user?.stripeSubscriptionStatus === "active") {
      const { url } = await portalMutation.mutateAsync({
        stripeCustomerId: user?.stripeCustomerId || "",
        returnUrl: window.location.origin,
      });
      window?.location.assign(url);
    } else {
      const { url } = await sessionMutation.mutateAsync({
        priceId,
        returnUrl: window.location.origin,
      });
      url && window?.location.assign(url);
    }
  };

  return (
    <div>
      <div className="">
        <div>
          <h2 className="text-lg font-semibold leading-7 text-gray-900">
            Plans
          </h2>
          <p className="mt-1 leading-6 text-gray-600">
            Choose the plan thats right for you.
          </p>
        </div>
        <div className="mt-3">
          <SegmentedControls
            defaultValue={frequency}
            onValueChange={(frequency) =>
              setFrequency(frequency as PriceFrequency)
            }
          >
            <SegmentedControlsList>
              <SegmentedControlsTrigger value="month">
                Monthly
              </SegmentedControlsTrigger>
              <SegmentedControlsTrigger value="year">
                Yearly
              </SegmentedControlsTrigger>
            </SegmentedControlsList>
          </SegmentedControls>

          <div className="mt-6 w-full space-y-6 lg:flex lg:justify-between lg:space-x-6 lg:space-y-0">
            {products
              ?.sort(
                (pA, pB) =>
                  Number(pA?.prices?.month?.price) -
                  Number(pB?.prices?.month?.price),
              )
              .map((product) => (
                <Card
                  className="w-full border border-gray-300 p-5"
                  key={product.id}
                >
                  <div>
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="text-dark-300 mt-2 text-sm leading-normal">
                      {product.description}
                    </p>
                  </div>

                  <div>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-3xl font-bold tracking-tight text-gray-900">
                        {formatCurrency(product.prices[frequency].price) ||
                          "$0"}
                      </span>
                      <span className="text-sm font-semibold leading-loose text-gray-600">
                        / {frequency}
                      </span>
                    </p>

                    {!user?.stripeSubscriptionId && (
                      <div className="mt-6">
                        <Button
                          onClick={() =>
                            handleUpgrade(
                              product.prices[frequency].id as string,
                            )
                          }
                          disabled={
                            !user?.stripeSubscriptionId &&
                            product.name.toLowerCase() === "free"
                          }
                        >
                          Get plan
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
