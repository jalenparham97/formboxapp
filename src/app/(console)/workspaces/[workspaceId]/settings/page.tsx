import { WorkspaceSettingsView } from "@/components/workspaces/workspace-settings-view";

interface Props {
  params: { workspaceId: string };
}

export default function WorkspaceSettingsPage({
  params: { workspaceId },
}: Props) {
  return <WorkspaceSettingsView workspaceId={workspaceId} />;
}
