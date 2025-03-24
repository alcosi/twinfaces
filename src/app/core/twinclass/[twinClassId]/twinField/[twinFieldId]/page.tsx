"use client";

import { useContext, useEffect, useState } from "react";

import { TwinClassContext } from "@/entities/twin-class";
import {
  TwinClassFieldV2_DETAILED,
  useFetchTwinClassFieldById,
} from "@/entities/twin-class-field";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { LoadingOverlay } from "@/shared/ui/loading";
import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinFieldGeneral } from "./twin-field-general";

interface TwinFieldPageProps {
  params: {
    twinFieldId: string;
  };
}

export default function TwinClassPage({
  params: { twinFieldId },
}: TwinFieldPageProps) {
  const { twinClass } = useContext(TwinClassContext);
  const [twinField, setTwinField] = useState<
    TwinClassFieldV2_DETAILED | undefined
  >(undefined);
  const { setBreadcrumbs } = useBreadcrumbs();
  const { fetchTwinClassFieldById, loading } = useFetchTwinClassFieldById();

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

  useEffect(() => {
    fetchTwinClassData();
  }, [twinFieldId]);

  async function fetchTwinClassData() {
    if (twinFieldId) {
      const response = await fetchTwinClassFieldById(twinFieldId);
      setTwinField(response);
    }
  }

  const tabs: Tab[] = twinField
    ? [
        {
          key: "general",
          label: "General",
          content: (
            <TwinFieldGeneral onChange={fetchTwinClassData} field={twinField} />
          ),
        },
      ]
    : [];

  return (
    <div>
      {loading && <LoadingOverlay />}
      {twinField && <TabsLayout tabs={tabs} />}
    </div>
  );
}
