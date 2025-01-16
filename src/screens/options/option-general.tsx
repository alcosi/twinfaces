"use client";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { useContext, useEffect, useState } from "react";
import { LoadingOverlay } from "@/shared/ui";
import { DataListOptionV3, useDatalistOption } from "@/entities/option";
import { DatalistContext } from "../../app/workspace/datalists/[datalistId]/datalist-context";
import { Tab, TabsLayout } from "@/widgets/layout";
import { DatalistOptionGeneral } from "./views";

export function OptionScreen({ optionId }: { optionId: string }) {
  const [datalistOption, setDatalistOption] = useState<
    DataListOptionV3 | undefined
  >(undefined);
  const { fetchDatalistOptionById } = useDatalistOption();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { datalist } = useContext(DatalistContext);
  const { loading } = useDatalistOption();

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
