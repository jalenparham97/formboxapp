import { SettingsLayout } from "@/components/settings/settings-layout";

export const metadata = {
  title: "Settings | SaaS Template",
  description: "Manage account and website settings.",
};

interface Props {
  children: React.ReactNode;
  params: { orgId: string };
}

export default function SettingsPageLayout({ children, params }: Props) {
  return (
    <SettingsLayout orgId={params.orgId}>
      <div>{children}</div>
    </SettingsLayout>
  );
}
