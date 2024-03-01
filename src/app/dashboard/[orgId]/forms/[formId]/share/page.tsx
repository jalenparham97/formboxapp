import { FormShareView } from "@/components/forms/form-share-view";

interface Props {
  params: { formId: string };
}

export default function SharePage({ params: { formId } }: Props) {
  return <FormShareView formId={formId} />;
}
