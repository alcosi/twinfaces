"use client";

import { House } from "lucide-react";
import Link from "next/link";
import React from "react";

import { ThemeToggle } from "@/features/ui/theme-toggle";
import { cn } from "@/shared/libs";
import { useParsedURLBreadcrumbs } from "@/shared/libs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";
import { SidebarTrigger } from "@/shared/ui/sidebar";

export function SidebarLayoutHeader() {
  const breadcrumbs = useParsedURLBreadcrumbs();

  return (
    <header className="border-border bg-background sticky top-0 z-10 flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center">
        <SidebarTrigger className="border-border bg-sidebar z-20 mt-16 mr-8 -ml-8 border shadow-sm" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/">
                <House className="h-4 w-4" />
              </Link>
            </BreadcrumbItem>
            {breadcrumbs?.slice(1).map((item, index, array) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    href={item.href}
                    title={item.label}
                    className={cn(
                      "max-w-28 truncate",
                      index === array.length - 1 && "font-semibold"
                    )}
                  >
                    {item.label}
                  </Link>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <ThemeToggle />
    </header>
  );
}
