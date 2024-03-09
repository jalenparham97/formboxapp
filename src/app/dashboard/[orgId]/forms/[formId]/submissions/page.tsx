import { FormSubmissionsView } from "@/components/forms/form-submissions-view";

interface Props {
  params: { formId: string };
}

export default function SubmissionsPage({ params: { formId } }: Props) {
  return <FormSubmissionsView formId={formId} />;
}
