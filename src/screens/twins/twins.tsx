"use client";

import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { TwinsTable } from "@/widgets/tables";

export function TwinsScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Twins", href: `/${PlatformArea.core}/twins` }]);
  }, []);

  return <TwinsTable />;
}
