import { FormSetupView } from "@/components/forms/form-setup-view";

interface Props {
  params: { formId: string };
}

export default function SharePage({ params: { formId } }: Props) {
  return <FormSetupView formId={formId} />;
}
