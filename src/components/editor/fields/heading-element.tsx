import { Input } from "@/components/ui/input";
import { FormField } from "@prisma/client";

interface Props {
  field: FormField;
}

export function HeadingElement({ field }: Props) {
  return (
    <div className="w-full rounded-xl p-4 hover:bg-gray-100">
      <input
        className="w-full border-none bg-transparent p-0 text-xl font-semibold focus:ring-0"
        placeholder="Enter a subheading"
      />
    </div>
  );
}
