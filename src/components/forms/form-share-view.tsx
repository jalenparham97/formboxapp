"use client";

import { useWindow } from "@/hooks/use-window";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useClipboard } from "@/hooks/use-clipboard";

interface Props {
  formId: string;
}

export function FormShareView({ formId }: Props) {
  const window = useWindow();
  const { copy, copied } = useClipboard();

  const formEndpointUrl = `${window?.location.origin}/forms/${formId}`;

  const copyFormEndpointUrl = () => {
    copy(formEndpointUrl);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Share link</h3>
          <p className="mt-2 max-w-lg text-gray-600">
            Your form is now ready to be shared. Copy this link to share your
            form on messaging apps, social media, or via email.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mt-2">
          <Card className="flex w-full items-center justify-between py-2 pl-3 pr-2 lg:w-[600px]">
            <p className="select-all text-sm sm:text-base">{formEndpointUrl}</p>
          </Card>
        </div>

        <div className="mt-3">
          <Button
            onClick={copyFormEndpointUrl}
            rightIcon={
              copied ? <IconCheck size={16} /> : <IconCopy size={16} />
            }
          >
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
      </div>
    </div>
  );
}
