"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/tailwind-helpers";

interface Props {
  text: string;
  href: string;
}

export function WorkspaceNavItem({ text, href }: Props) {
  const pathname = usePathname();
  const isActive = pathname.includes(href);

  return (
    <div>
      <Link href={href} className="no-underline">
        <div
          className={cn(
            "flex w-full items-center rounded-lg border-none py-[8px] text-left text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900",
            isActive && "bg-gray-100 text-gray-900 hover:bg-gray-100",
          )}
        >
          <div className="flex w-full items-center space-x-2 pl-3">
            <p>{text}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
