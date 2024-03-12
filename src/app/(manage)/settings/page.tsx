import { SettingsView } from "@/components/settings/settings-view";
import { COMPANY_NAME } from "@/utils/constants";

export const metadata = {
  title: `Settings - ${COMPANY_NAME}`,
};

export default function SettingsPage() {
  return <SettingsView />;
}
