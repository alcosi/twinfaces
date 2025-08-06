"use client";

import { House } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

import { FaceBC001Item } from "@/entities/face";
import { PlatformArea } from "@/shared/config";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui";

type Props = {
  items: FaceBC001Item[];
  activeTwinId: string;
};

export function BreadCrumbs({ items, activeTwinId }: Props) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/">
            <House className="h-4 w-4" />
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {items.map((item, index) => {
          const isActive = item.twinId === activeTwinId;
          const href =
            item.label === "Products"
              ? `/${PlatformArea.workspace}/products`
              : `/${PlatformArea.browse}/${item.twinId}`;

          return (
            <Fragment key={item.id}>
              <BreadcrumbItem>
                {isActive ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <Link
                    href={href}
                    className={isActive ? "text-foreground font-semibold" : ""}
                  >
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
  );
}
