import { OrgMembersView } from "@/components/orgs/org-members-view";

export const metadata = {
  title: `Members - Settings`,
};

interface Props {
  params: { orgId: string };
}

export default function OrgMembersPage({ params: { orgId } }: Props) {
  return <OrgMembersView orgId={orgId} />;
}
