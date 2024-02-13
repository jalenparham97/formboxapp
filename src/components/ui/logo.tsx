import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils/tailwind-helpers";

interface Props {
  noLink?: boolean;
  href?: string;
  className?: string;
}

export function Logo({ noLink = false, href = "/", className }: Props) {
  if (noLink) {
    return (
      <div>
        <Image
          className={cn("!-ml-2 w-28", className)}
          src="/images/logo.png"
          alt=""
          width={80}
          height={70}
        />
      </div>
    );
  }

  return (
    <div>
      <Link href={href}>
        <Image
          className={cn("!-ml-2 w-28", className)}
          src="/images/logo.png"
          alt=""
          width={80}
          height={70}
        />
      </Link>
    </div>
  );
}
