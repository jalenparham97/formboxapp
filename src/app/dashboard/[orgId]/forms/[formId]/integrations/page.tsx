interface Props {
  params: { formId: string; orgId: string };
}

export default function IntegrationsPage({ params: { orgId, formId } }: Props) {
  return <div>Integrations Page</div>;
}
