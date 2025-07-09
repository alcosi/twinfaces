"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  TwinClassFieldV2_DETAILED,
  useFetchTwinClassFieldById,
} from "@/entities/twin-class-field";
import { TwinClassFieldScreen } from "@/screens/twin-class-field";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type Props = {
  params: {
    twinFieldId: string;
  };
};

export default function Page({ params: { twinFieldId } }: Props) {
  const { fetchTwinClassFieldById, loading } = useFetchTwinClassFieldById();
  const [twinField, setTwinField] = useState<
    TwinClassFieldV2_DETAILED | undefined
  >(undefined);

  useEffect(() => {
    fetchData();
  }, [twinFieldId]);

  async function fetchData() {
    try {
      const response = await fetchTwinClassFieldById(twinFieldId);

      if (response) {
        setTwinField(response);
      }
    } catch {
      toast.error("Failed to fetch twin field");
    }
  }

  if (isUndefined(twinField) || loading) return <LoadingOverlay />;

  return (
    <TwinClassFieldScreen
      twinFieldId={twinFieldId}
      twinField={twinField}
      refresh={fetchData}
    />
  );
}
