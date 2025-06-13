"use client";

import { usePathname } from "next/navigation";

interface Breadcrumb {
  label: string;
  href: string;
}

function mergeBreadcrumbs(breadcrumbs: Breadcrumb[]): Breadcrumb[] {
  const merged = [...breadcrumbs];

  if (breadcrumbs.length >= 5) {
    const thirdCrumb = breadcrumbs[3];
    const thirdCrumbId = breadcrumbs[4];

    merged.splice(3, 2, {
      label: `${thirdCrumb?.label}/${thirdCrumbId?.label}`,
      href: thirdCrumbId?.href || "",
    });
  }

  return merged;
}

export function useParsedURLBreadcrumbs(): Breadcrumb[] {
  const path = usePathname();
  const pathArr = path?.trim()?.split("?")[0]?.split("/").filter(Boolean);

  const parsedBreadcrumbs =
    pathArr?.map((item, index) => {
      const href = "/" + pathArr.slice(0, index + 1).join("/");
      const isUUID =
        /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(
          item
        );

      const label = isUUID
        ? `ID: ${item.slice(0, 8)}`
        : item === "workspace"
          ? item
          : item.charAt(0).toUpperCase() + item.slice(1);

      return { label, href };
    }) ?? [];

  return mergeBreadcrumbs(parsedBreadcrumbs);
}
