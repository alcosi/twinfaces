"use client";

import { House } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

import { FaceBC001Item } from "@/entities/face";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui";

import { ThemeToggle } from "../theme-toggle";

type Props = {
  items: FaceBC001Item[];
};

export function ServerBreadcrumbHeader({ items }: Props) {
  return (
    <header className="border-border bg-background sticky top-0 z-10 flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/">
                <House className="h-4 w-4" />
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {items.map((item, index) => {
              const isActive = index === items.length - 1;
              const href =
                item.label === "Products" || item.label === "Marketplaces"
                  ? `/${PlatformArea.workspace}/${item.label.toLowerCase()}`
                  : `/${PlatformArea.browse}/${item.twinId}`;

              const Icon = isPopulatedString(item.iconUrl)
                ? () => (
                    <Image
                      src={item.iconUrl ?? ""}
                      alt="icon"
                      width={16}
                      height={16}
                      className="mr-2 dark:invert"
                    />
                  )
                : undefined;

              return (
                <Fragment key={item.id}>
                  <BreadcrumbItem>
                    {isActive ? (
                      <BreadcrumbPage className="flex">
                        {Icon && <Icon />}
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <Link
                        href={href}
                        className={`flex ${isActive ? "text-foreground font-semibold" : ""}`}
                      >
                        {Icon && <Icon />}
                        {item.label}
                      </Link>
                    )}
                  </BreadcrumbItem>
                  {index < items.length - 1 && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <ThemeToggle />
    </header>
  );
}
