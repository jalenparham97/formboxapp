import { type ReactNode } from "react";
import { cn } from "@/utils/tailwind-helpers";

export function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("px-4 py-4 lg:px-16 lg:py-8", className)}>
      {children}
    </div>
  );
}
