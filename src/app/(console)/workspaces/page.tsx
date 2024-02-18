import { WorkspacesView } from "@/components/workspaces/workspaces-view";
import { api } from "@/trpc/server";
import { Suspense } from "react";

export default async function WorkspacesPage() {
  const initialData = await api.workspace.getAll.query({});

  return (
    // <Suspense fallback={<p>Loading...</p>}>
    <WorkspacesView initialData={initialData} />
    // </Suspense>
  );
}
