import { env } from "@/env";
import { type User } from "@prisma/client";

const dataApiEndpoint = `https://data.mongodb-api.com/app/${env.MONGO_APP_ID}/endpoint/data/v1/action`;

export async function getUser(email: string) {
  const response = await fetch(`${dataApiEndpoint}/findOne`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": env.MONGO_API_KEY,
    },
    body: JSON.stringify({
      collection: "users",
      database: "dev",
      dataSource: "saas-template",
      filter: { email },
    }),
  });

  const result = await response.json();

  return result.document as User;
}
