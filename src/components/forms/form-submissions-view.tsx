"use client";

import {
  SegmentedControls,
  SegmentedControlsContent,
  SegmentedControlsList,
  SegmentedControlsTrigger,
} from "@/components/ui/segmented-controls";
import { SubmissionInboxView } from "./submission-inbox-view";
import { SubmissionSpamView } from "./submission-spam-view";

interface Props {
  formId: string;
}

export function FormSubmissionsView({ formId }: Props) {
  return (
    <SegmentedControls defaultValue="inbox" className="w-full">
      <SegmentedControlsList>
        <SegmentedControlsTrigger value="inbox">Inbox</SegmentedControlsTrigger>
        <SegmentedControlsTrigger value="spam">Spam</SegmentedControlsTrigger>
      </SegmentedControlsList>
      <SegmentedControlsContent value="inbox" className="mt-4">
        <SubmissionInboxView formId={formId} />
      </SegmentedControlsContent>
      <SegmentedControlsContent value="spam" className="mt-4">
        <SubmissionSpamView formId={formId} />
      </SegmentedControlsContent>
    </SegmentedControls>
  );
}
