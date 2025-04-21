"use client";

import { useContext, useEffect } from "react";

import { TwinClassContext } from "@/entities/twin-class";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinFieldContext } from "@/features/twin-class-field";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinFieldGeneral } from "./twin-field-general";

export default function TwinClassPage() {
  const { twinClass } = useContext(TwinClassContext);
  const { twinFieldId, twinField } = useContext(TwinFieldContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes", href: `/${PlatformArea.core}/twinclass` },
      {
        label: twinClass?.name!,
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}`,
      },
      {
        label: "Fields",
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}#fields`,
      },
      {
        label: twinField?.name ?? "N/A",
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}/twinField/${twinFieldId}`,
      },
    ]);
  }, [twinClass?.id, twinClass?.name, twinFieldId, twinField?.name]);

  const tabs: Tab[] = twinField
    ? [
        {
          key: "general",
          label: "General",
          content: <TwinFieldGeneral />,
        },
      ]
    : [];

  return <TabsLayout tabs={tabs} />;
}
