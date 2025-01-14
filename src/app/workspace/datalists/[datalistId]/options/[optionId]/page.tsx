"use client";

import { LoadingOverlay } from "@/shared/ui/loading";
import { Tab, TabsLayout } from "@/widgets/layout";
import { useContext, useEffect, useState } from "react";
import { DatalistOptionGeneral } from "./datalist-option-general";
import { DataListOptionV1, useDatalistOption } from "@/entities/option";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { DatalistContext } from "../../datalist-context";

interface DatalistOptionPageProps {
  params: {
    optionId: string;
  };
}

export default function DatalistOptionPage({
  params: { optionId },
}: DatalistOptionPageProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [datalistOption, setDatalistOption] = useState<
    DataListOptionV1 | undefined
  >(undefined);
  const { fetchDatalistOptionById } = useDatalistOption();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { datalist } = useContext(DatalistContext);

  useEffect(() => {
    fetchDatalistOptions();
  }, [optionId]);

  async function fetchDatalistOptions() {
    if (optionId) {
      setLoading(true);
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
      {!loading && <LoadingOverlay />}
      {datalistOption && <TabsLayout tabs={tabs} />}
    </div>
  );
}
