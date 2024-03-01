import { useFormStore } from "@/stores/editor.store";
import React from "react";
import TextareaAutosize from "react-textarea-autosize";

export function EditorTitleAndDescription() {
  const { formState } = useFormStore();

  return (
    <div className="m-auto flex h-full max-w-[720px] flex-col items-center justify-start px-10">
      <div className="w-full space-y-6">
        <input
          defaultValue={formState?.headerTitle}
          className="w-full border-none bg-transparent p-0 text-3xl font-semibold focus:ring-0"
          placeholder="Form title"
        />
        <TextareaAutosize
          defaultValue={formState?.headerDescription}
          className="w-full resize-none border-none p-0 focus:ring-0"
          placeholder="Form description (optional)"
          rows={1}
          // onChange={updateFormHeaderDescription}
        />
      </div>
    </div>
  );
}
