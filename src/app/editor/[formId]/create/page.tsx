import { EditorPageView } from "@/components/editor/editor-page-view";
import React from "react";

interface Props {
  params: { formId: string };
}

export default function Page({ params: { formId } }: Props) {
  return <EditorPageView formId={formId} />;
}
