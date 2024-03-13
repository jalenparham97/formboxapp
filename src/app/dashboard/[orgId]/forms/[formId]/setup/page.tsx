import { FormSetupView } from "@/components/forms/form-setup-view";
import { api } from "@/trpc/server";
import { type Metadata } from "next";

interface Props {
  params: { formId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const form = await api.form.getById.query({ id: params.formId });
  return {
    title: `Setup - ${form?.name}`,
  };
}

export default function SharePage({ params: { formId } }: Props) {
  return <FormSetupView formId={formId} />;
}
