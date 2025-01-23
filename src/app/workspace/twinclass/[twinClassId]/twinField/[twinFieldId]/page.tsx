"use client";

import { TwinClassContext } from "@/entities/twinClass";
import {
  TwinClassFieldV2_DETAILED,
  useTwinClassField,
} from "@/entities/twin-class-field";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { LoadingOverlay } from "@/shared/ui/loading";
import { Tab, TabsLayout } from "@/widgets/layout";
import { useContext, useEffect, useState } from "react";
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
  const { fetchTwinClassFieldById, loading } = useTwinClassField();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes", href: "/workspace/twinclass" },
      {
        label: twinClass?.name!,
        href: `/workspace/twinclass/${twinClass?.id}`,
      },
      {
        label: "Fields",
        href: `/workspace/twinclass/${twinClass?.id}#fields`,
      },
      {
        label: twinField?.name ?? "N/A",
        href: `/workspace/twinclass/${twinClass?.id}/twinField/${twinFieldId}`,
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
