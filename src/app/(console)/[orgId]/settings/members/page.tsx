import { OrgMembersView } from "@/components/orgs/org-members-view";

interface Props {
  params: { orgId: string };
}

export default function OrgMembersPage({ params: { orgId } }: Props) {
  return <OrgMembersView orgId={orgId} />;
}
