import { DashboardView } from "@/components/dashboard/dashboard-view";
import { api } from "@/trpc/server";

export default async function OrgDashboardPage() {
  const initialData = await api.workspace.getAll.query({});

  return <DashboardView initialData={initialData} />;
}
