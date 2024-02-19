import { DashboardView } from "@/components/dashboard/dashboard-view";
import { api } from "@/trpc/server";

interface Props {
  params: { orgId: string };
}

export default async function OrgDashboardPage({ params: { orgId } }: Props) {
  // const initialData = await api.workspace.getAll.query({});

  return <DashboardView orgId={orgId} />;
}
