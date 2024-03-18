import NangoClient from "@nangohq/frontend";
import { type IntegrationType } from "@/types/integration.types";

export const nangoClient = new NangoClient({
  publicKey: "23607d36-ed6c-432b-a4ed-ee2bf934e05b",
});

export async function createConnection(
  integration: IntegrationType,
  userId: string,
) {
  return await nangoClient.auth(integration, userId);
}
