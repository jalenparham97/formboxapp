import { SettingsLayout } from "@/components/settings/settings-layout";

export const metadata = {
  title: "Settings | SaaS Template",
  description: "Manage account and website settings.",
};

export default function SettingsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsLayout>
      <div>{children}</div>
    </SettingsLayout>
  );
}
