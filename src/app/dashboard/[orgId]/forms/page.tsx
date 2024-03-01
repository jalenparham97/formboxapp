import { DashboardView } from "@/components/dashboard/dashboard-view";
import { api } from "@/trpc/server";

interface Props {
  params: { orgId: string };
}

export default async function FormsPage({ params: { orgId } }: Props) {
  // const initialData = await api.form.getAll.query({});

  return <DashboardView orgId={orgId} />;
}
