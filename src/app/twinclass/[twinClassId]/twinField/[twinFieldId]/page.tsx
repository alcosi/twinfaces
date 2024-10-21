"use client";

import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import { TwinFieldGeneral } from "@/app/twinclass/[twinClassId]/twinField/[twinFieldId]/twin-field-general";
import { LoadingOverlay } from "@/components/base/loading";
import { ApiContext } from "@/lib/api/api";
import { TwinClassField } from "@/lib/api/api-types";
import { ReturnOptions, Section, SideNavLayout } from "@/widgets/layouts";
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

  const sections: Section[] = twinField
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

  const returnOptions: ReturnOptions[] = [
    {
      path: `/twinclass/${twinClass?.id}#fields`,
      label: "Back",
    },
  ];

  return (
    <div>
      {loading && <LoadingOverlay />}
      {twinField && (
        <SideNavLayout sections={sections} returnOptions={returnOptions}>
          <h1 className="text-xl font-bold">{twinField.name}</h1>
        </SideNavLayout>
      )}
    </div>
  );
}
