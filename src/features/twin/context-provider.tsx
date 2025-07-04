"use client";

import React, { createContext, useEffect, useState } from "react";

import { useTwinFetchByIdV2 } from "@/entities/twin";
import { useTwinClassSearchV1 } from "@/entities/twin-class";
import { Twin_DETAILED } from "@/entities/twin/server";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";

interface TwinContextProps {
  twinId: string;
  twin: Twin_DETAILED;
  refresh: () => void;
}

export const TwinContext = createContext<TwinContextProps>(
  {} as TwinContextProps
);

export function TwinContextProvider({
  twinId,
  children,
}: {
  twinId: string;
  children: React.ReactNode;
}) {
  const [twin, setTwin] = useState<Twin_DETAILED | undefined>(undefined);
  const { fetchTwinById, loading: twinLoading } = useTwinFetchByIdV2();
  const { searchTwinClasses, loading: twinClassLoading } =
    useTwinClassSearchV1();

  useEffect(() => {
    console.log(
      "🥊 TwinContextProvider mounted value changed (twinId): ",
      twinId
    );
    return () => {
      console.log("🥊 🥊 TwinContextProvider unmounted");
    };
  });

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const twin = await fetchTwinById(twinId);

      if (twin) {
        const { data } = await searchTwinClasses({
          filters: {
            headHierarchyChildsForTwinClassSearch: {
              idList: [twin?.twinClassId],
              depth: 1,
            },
          },
        });

        twin.subordinates = data;
      }

      setTwin(twin);
    } catch (error) {
      console.error("Failed to fetch twin:", error);
    }
  }

  if (isUndefined(twin)) return <LoadingOverlay />;

  return (
    <TwinContext.Provider
      value={{
        twinId,
        twin,
        refresh,
      }}
    >
      {twinLoading || twinClassLoading ? <LoadingOverlay /> : children}
    </TwinContext.Provider>
  );
}
