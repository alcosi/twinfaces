"use client";

import { TwinClassContext } from "@/entities/twinClass";
import { TwinClassField } from "@/entities/twinClassField";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { ApiContext } from "@/shared/api";
import { LoadingOverlay } from "@/shared/ui/loading";
import { Tab, TabsLayout } from "@/widgets/layout";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { TwinFieldGeneral } from "./twin-field-general";

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

  function fetchTwinClassData() {
    if (twinFieldId) {
      setLoading(true);

      api.twinClassField
        .getById({
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
