import { WorkspacePageLayout } from "@/components/workspaces/workspace-page-layout";

interface Props {
  children: React.ReactNode;
  params: { workspaceId: string };
}

export default function WorkspaceLayout({
  children,
  params: { workspaceId },
}: Props) {
  return (
    <WorkspacePageLayout workspaceId={workspaceId}>
      <div>{children}</div>
    </WorkspacePageLayout>
  );
}
