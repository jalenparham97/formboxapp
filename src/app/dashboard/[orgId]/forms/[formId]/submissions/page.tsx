interface Props {
  params: { formId: string; orgId: string };
}

export default function SubmissionsPage({ params: { orgId, formId } }: Props) {
  return <div>Submissions Page</div>;
}
