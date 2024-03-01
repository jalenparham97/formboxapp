import { FormSubmissionsView } from "@/components/forms/form-submissions-view";

interface Props {
  params: { formId: string; orgId: string };
}

export default function Page({ params: { orgId, formId } }: Props) {
  return <FormSubmissionsView orgId={orgId} formId={formId} />;
}
