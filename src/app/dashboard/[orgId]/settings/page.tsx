import { OrgSettingsView } from "@/components/orgs/org-settings-view";
import { useOrgById } from "@/queries/org.queries";
import { api } from "@/trpc/server";

interface Props {
  params: { orgId: string };
}

export default async function SettingsProfilePage({
  params: { orgId },
}: Props) {
  return (
    <div>
      <div>
        <h2 className="text-lg font-semibold leading-7 text-gray-900">
          Organization settings
        </h2>
        <p className="mt-1 leading-6 text-gray-600">
          Manage your organization details.
        </p>
      </div>

      <div className="mt-6">
        <OrgSettingsView orgId={orgId} />
      </div>
    </div>
  );
}
