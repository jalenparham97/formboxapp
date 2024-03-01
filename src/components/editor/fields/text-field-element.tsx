import { Input } from "@/components/ui/input";
import { FormField } from "@prisma/client";

interface Props {
  field: FormField;
}

export function TextFieldElement({ field }: Props) {
  return (
    <div className="w-full rounded-xl p-4 hover:bg-gray-100">
      <Input className="w-full" placeholder="" label={field.label} disabled />
    </div>
  );
}
