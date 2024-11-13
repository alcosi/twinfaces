import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/base/breadcrumb";
import { SidebarTrigger } from "@/components/base/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { cn } from "@/shared/libs";
import { House } from "lucide-react";
import Link from "next/link";
import React from "react";

export function SidebarLayoutHeader() {
  const { breadcrumbs } = useBreadcrumbs();

  return (
    <header className="sticky top-0 z-10 flex justify-between items-center h-16 px-4 md:px-6 border-b bg-background">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="border -ml-9 mr-9 z-20 shadow bg-sidebar" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/">
                <House className="w-4 h-4" />
              </Link>
            </BreadcrumbItem>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    href={item.href}
                    className={cn(
                      index === breadcrumbs.length - 1 && "font-semibold"
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
