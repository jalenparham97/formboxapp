"use client";

import { type SubmissionOutput } from "@/types/submission.types";
import { IconClock, IconInbox } from "@tabler/icons-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { SubmissionCardActionsMenu } from "./submission-card-actions-menu";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/utils/tailwind-helpers";
import { Badge } from "@/components/ui/badge";

const getEmail = (submission: SubmissionOutput) => {
  return (
    submission.answers.find((answer) =>
      answer.label.toLowerCase().includes("email"),
    )?.value || "Anonymous"
  );
};

interface Props {
  submission: SubmissionOutput;
}

export function SubmissionCard({ submission }: Props) {
  return (
    <Card key={submission.id} className="overflow-hidden">
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger
          asChild
          className="w-full cursor-pointer hover:bg-gray-100"
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-6">
                {/* <div>
                  <Checkbox onClick={(e) => e.stopPropagation()} />
                </div> */}
                <div>
                  <p className="-mt-[3.5px] flex items-center space-x-2 text-gray-600">
                    <IconInbox size={16} />{" "}
                    <span className="font-semibold">
                      {getEmail(submission)}
                    </span>
                  </p>
                  <p className="mt-1 flex items-center space-x-2 text-sm text-gray-600">
                    <IconClock size={16} />{" "}
                    <span>
                      {formatDate(submission.createdAt, "MMM DD, YYYY h:mm A")}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {submission.isSpam && <Badge variant="yellow">Spam</Badge>}
                <SubmissionCardActionsMenu submission={submission} />
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Divider />

          <div className="p-4">
            <div className="space-y-2 divide-y divide-gray-200">
              {submission.answers.map((answer, i) => (
                <div key={answer.label}>
                  <div className={cn("space-y-1 pt-1", i === 0 && "pt-0")}>
                    <h4 className="font-medium text-gray-500">
                      {answer.label}
                    </h4>
                    <p>{answer.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
