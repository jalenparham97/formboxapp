import { FormSubmissionsView } from "@/components/forms/form-submissions-view";
import { api } from "@/trpc/server";
import { type Metadata } from "next";

interface Props {
  params: { formId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const form = await api.form.getById.query({ id: params.formId });
  return {
    title: `Submissions - ${form?.name}`,
  };
}

export default function Page({ params: { formId } }: Props) {
  return <FormSubmissionsView formId={formId} />;
}
