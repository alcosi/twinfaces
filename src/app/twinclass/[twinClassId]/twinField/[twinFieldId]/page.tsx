"use client";

import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import { TwinFieldGeneral } from "@/app/twinclass/[twinClassId]/twinField/[twinFieldId]/twin-field-general";
import { LoadingOverlay } from "@/components/base/loading";
import { TwinClassField } from "@/entities/twinClass";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { ApiContext } from "@/shared/api";
import { Tab, TabsLayout } from "@/widgets";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface TwinFieldPageProps {
  params: {
    twinFieldId: string;
  };
}

export default function TwinClassPage({
  params: { twinFieldId },
}: TwinFieldPageProps) {
  const api = useContext(ApiContext);
  const { twinClass } = useContext(TwinClassContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [twinField, setTwinField] = useState<TwinClassField | undefined>(
    undefined
  );
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes", href: "/twinclass" },
      { label: twinClass?.name!, href: `/twinclass/${twinClass?.id}#fields` },
      {
        label: "Field",
        href: `/twinclass/${twinClass?.id}/twinField/${twinFieldId}`,
      },
    ]);
  }, [twinClass?.id, twinClass?.name, twinFieldId]);

  useEffect(() => {
    fetchTwinClassData();
  }, [twinFieldId]);

  function fetchTwinClassData() {
    if (twinFieldId) {
      setLoading(true);

      api.twinClass
        .getFieldById({
          fieldId: twinFieldId,
        })
        .then((response) => {
          const data = response.data;
          if (!data || data.status != 0) {
            console.error("failed to fetch twin class", data);
            let message = "Failed to load twin class";
            if (data?.msg) message += `: ${data.msg}`;
            toast.error(message);
            return;
          }
          setTwinField(data.field);
        })
        .catch((e) => {
          console.error("exception while fetching twin class", e);
          toast.error("Failed to fetch twin class");
        })
        .finally(() => setLoading(false));
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
