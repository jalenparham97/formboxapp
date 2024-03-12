import { SettingsLayout } from "@/components/settings/settings-layout";
import { COMPANY_NAME } from "@/utils/constants";

export const metadata = {
  title: `Settings - ${COMPANY_NAME}`,
};

interface Props {
  children: React.ReactNode;
  params: { orgId: string };
}

export default function SettingsPageLayout({
  children,
  params: { orgId },
}: Props) {
  return (
    <SettingsLayout orgId={orgId}>
      <div>{children}</div>
    </SettingsLayout>
  );
}
