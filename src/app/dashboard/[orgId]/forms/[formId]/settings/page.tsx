import { FormSettingsView } from "@/components/forms/form-settings-view";

interface Props {
  params: { formId: string; orgId: string };
}

export default function SettingsPage({ params: { orgId, formId } }: Props) {
  return <FormSettingsView orgId={orgId} formId={formId} />;
}
