import { cn } from "@/utils/tailwind-helpers";
import React from "react";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export function Paper({ children, className }: Props) {
  return (
    <div
      className={cn(
        "h-full rounded-lg border border-gray-200 shadow",
        className
      )}
    >
      {children}
    </div>
  );
}
