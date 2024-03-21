const FREE_PLAN = "free";
const STARTER_PLAN = "starter";
const PROFESSIONAL_PLAN = "professional";
const BUSINESS_PLAN = "business";

export type Plan = "free" | "starter" | "professional" | "business";

export type Feature =
  | "3 forms"
  | "20 forms"
  | "Unlimited forms"
  | "Unlimited team members"
  | "Unlimited form submissions"
  | "Unlimited submission archive"
  | "60 days submission archive"
  | "90 days submission archive"
  | "365 days submission archive"
  | "AJAX support"
  | "Spam Protection"
  | "Data export"
  | "Email notifications"
  | "Custom redirect"
  | "Auto responses"
  | "Domain restrictions"
  | "Webhooks"
  | "Integrations"
  | "Custom honeypot"
  | "Basic support"
  | "Priority support"
  | "Submission storage duration";

/**
 * This is a mapping from stripe product ids to the features they unlock.
 * The keys are in the order of increasingly powerful products.
 * ex: Hobby ($10) -> Business ($20) -> Enterprise ($30)
 * ex: All the features unlocked by Business are also automatically unlocked by Enterprise.
 */
const FEATURE_UNLOCKS_BY_PLAN: Record<string, Feature[]> = {
  [FREE_PLAN]: [
    "3 forms",
    "Unlimited team members",
    "Unlimited form submissions",
    "60 days submission archive",
    "AJAX support",
    "Spam Protection",
    "Data export",
    "Email notifications",
    "Basic support",
  ],
  [STARTER_PLAN]: [
    "20 forms",
    "Unlimited team members",
    "Unlimited form submissions",
    "90 days submission archive",
    "AJAX support",
    "Spam Protection",
    "Data export",
    "Email notifications",
    "Custom redirect",
    "Custom honeypot",
    "Integrations",
    "Basic support",
  ],
  [PROFESSIONAL_PLAN]: [
    "Unlimited forms",
    "Unlimited team members",
    "Unlimited form submissions",
    "365 days submission archive",
    "AJAX support",
    "Spam Protection",
    "Data export",
    "Email notifications",
    "Custom redirect",
    "Domain restrictions",
    "Integrations",
    "Auto responses",
    "Custom honeypot",
    "Webhooks",
    "Basic support",
  ],
  [BUSINESS_PLAN]: [
    "Unlimited forms",
    "Unlimited team members",
    "Unlimited form submissions",
    "Unlimited submission archive",
    "AJAX support",
    "Spam Protection",
    "Data export",
    "Email notifications",
    "Custom redirect",
    "Domain restrictions",
    "Integrations",
    "Auto responses",
    "Custom honeypot",
    "Webhooks",
    "Submission storage duration",
    "Priority support",
  ],
};

const SORTED_PLANS = Object.keys(FEATURE_UNLOCKS_BY_PLAN);

export const ALL_FEATURES = Object.values(FEATURE_UNLOCKS_BY_PLAN).flat();

/**
 * hasFeatureAccess checks if a subscription has access to a feature.
 * This assumes that subscriptions on the SORTED_PRODUCT_IDS list
 * have access to all features unlocked by previous products.
 */
export function hasFeatureAccess(
  plan: string | null | undefined,
  feature: Feature,
): boolean {
  if (plan === null) {
    return false;
  }

  const planINdex = SORTED_PLANS.indexOf(plan as Plan);
  if (planINdex === -1) {
    console.error(`Plan ${plan} is not in the list of plans`);
    return false;
  }

  const relevantFeatures = Object.values(FEATURE_UNLOCKS_BY_PLAN)
    .slice(0, planINdex + 1)
    .flatMap((x) => x);

  return relevantFeatures.includes(feature);
}
