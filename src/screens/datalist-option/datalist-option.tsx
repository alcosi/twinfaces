"use client";

import {
  DataListOptionV3,
  useDatalistOption,
} from "@/entities/datalist-option";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { DatalistContext } from "@/features/datalist";
import { LoadingOverlay } from "@/shared/ui";
import { Tab, TabsLayout } from "@/widgets/layout";
import { useContext, useEffect, useState } from "react";
import { DatalistOptionGeneral } from "./views";

export function DatalistOptionScreen({ optionId }: { optionId: string }) {
  const [datalistOption, setDatalistOption] = useState<
    DataListOptionV3 | undefined
  >(undefined);
  const { fetchDatalistOptionById, loading } = useDatalistOption();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { datalist } = useContext(DatalistContext);

  useEffect(() => {
    fetchDatalistOptions();
  }, [optionId]);

  async function fetchDatalistOptions() {
    if (optionId) {
      const response = await fetchDatalistOptionById(optionId);
      setDatalistOption(response);
    }
  }

  useEffect(() => {
    setBreadcrumbs([
      { label: "Datalist", href: "/workspace/datalists" },
      {
        label: datalist?.name!,
        href: `/workspace/datalists/${datalist?.id}`,
      },
      {
        label: "Options",
        href: `/workspace/datalists/${datalist?.id}#options`,
      },
      {
        label: datalistOption?.name!,
        href: `/workspace/datalists/${datalist?.id}/options/${datalistOption?.id}`,
      },
    ]);
  }, [datalistOption, setBreadcrumbs]);

  const tabs: Tab[] = datalistOption
    ? [
        {
          key: "general",
          label: "General",
          content: <DatalistOptionGeneral datalistOption={datalistOption} />,
        },
      ]
    : [];

  return (
    <div>
      {loading && <LoadingOverlay />}
      {datalistOption && <TabsLayout tabs={tabs} />}
    </div>
  );
}
