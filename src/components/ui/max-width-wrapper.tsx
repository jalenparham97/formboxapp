import { cn } from "@/utils/tailwind-helpers";

export function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 sm:px-8 lg:px-10", className)}>
      {children}
    </div>
  );
}
