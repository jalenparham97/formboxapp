import { env } from "@/env";
import { createHash } from "crypto";

export const hashToken = (token: string) => {
  return createHash("sha256")
    .update(`${token}${env.NEXTAUTH_SECRET ?? ""}`)
    .digest("hex");
};
