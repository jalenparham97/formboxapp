import { WorkspaceMembersView } from "@/components/workspaces/workspace-members-view";

interface Props {
  params: { workspaceId: string };
}

export default function WorkspaceMembersPage({
  params: { workspaceId },
}: Props) {
  return <WorkspaceMembersView workspaceId={workspaceId} />;
}
