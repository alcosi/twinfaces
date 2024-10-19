"use client";

import { PathLinkMode } from "./layoutlink.common";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface PathLinkProps {
  href: string;
  children: React.ReactNode;
  mode: PathLinkMode;
  className?: string;
  enabledClassName?: string;
  disabledClassName?: string;
}

export function PathLink({
  href,
  children,
  mode,
  className,
  enabledClassName,
  disabledClassName,
}: PathLinkProps) {
  const pathname = usePathname();
  console.log(pathname, href);

  if (!pathname) {
    return (
      <Link href={href} className={cn(className, disabledClassName)}>
        {children}
      </Link>
    );
  }

  let isActive = false;
  if (mode === PathLinkMode.Exact) {
    isActive = pathname === href;
  } else if (mode === PathLinkMode.StartsWith) {
    const startsWithHref = pathname.startsWith(href);
    const nextChar = pathname[href.length];
    const isBoundary = !nextChar || nextChar === "/";

    isActive = startsWithHref && isBoundary;
  }

  return (
    <Link
      href={href}
      className={cn(
        className,
        isActive && enabledClassName,
        !isActive && disabledClassName
      )}
    >
      {children}
    </Link>
  );
}
