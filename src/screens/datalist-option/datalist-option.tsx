"use client";

import {
  DataListOptionV3,
  useDatalistOption,
} from "@/entities/datalist-option";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { isPopulatedString, isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";
import { Tab, TabsLayout } from "@/widgets/layout";
import React, { useEffect, useState } from "react";
import { DatalistOptionGeneral } from "./views";

export function DatalistOptionScreen({ optionId }: { optionId: string }) {
  const [datalistOption, setDatalistOption] = useState<
    DataListOptionV3 | undefined
  >(undefined);
  const { fetchDatalistOptionById, loading } = useDatalistOption();
  const { setBreadcrumbs } = useBreadcrumbs();

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
      {
        label: "Options",
        href: `/workspace/datalist-options`,
      },
      {
        label: isPopulatedString(datalistOption?.name)
          ? datalistOption.name
          : "N/A",
        href: `/workspace/datalist-options/${optionId}`,
      },
    ]);
  }, [datalistOption, setBreadcrumbs]);

  const tabs: Tab[] = datalistOption
    ? [
        {
          key: "general",
          label: "General",
          content: (
            <DatalistOptionGeneral
              datalistOption={datalistOption}
              fetchDatalistOptions={fetchDatalistOptions}
            />
          ),
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
