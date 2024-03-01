import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@prisma/client";

interface Props {
  field: FormField;
}

export function TextAreaFieldElement({ field }: Props) {
  return (
    <div className="w-full rounded-xl p-4 hover:bg-gray-100">
      <Textarea
        className="w-full"
        placeholder=""
        label={field.label}
        disabled
      />
    </div>
  );
}
