import React, { createContext, useEffect, useState } from "react";

import { Twin_DETAILED, useTwinFetchByIdV2 } from "@/entities/twin";
import {
  TwinClass_DETAILED,
  useTwinClassSearchV1,
} from "@/entities/twin-class";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";

interface TwinContextProps {
  twinId: string;
  twin: Twin_DETAILED;
  refresh: () => void;
  twinClass: TwinClass_DETAILED[] | undefined;
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
  const [twinClass, setTwinClass] = useState<TwinClass_DETAILED[] | undefined>(
    undefined
  );
  const { searchTwinClasses } = useTwinClassSearchV1();
  const { fetchTwinById, loading } = useTwinFetchByIdV2();

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (twin?.twinClassId) {
      fetchTwinClassData();
    }
  }, [twin?.twinClassId]);

  async function refresh() {
    try {
      const fetchedTwin = await fetchTwinById(twinId);

      if (fetchedTwin) {
        setTwin(fetchedTwin);
      }
    } catch (error) {
      console.error("Failed to fetch twin:", error);
    }
  }

  async function fetchTwinClassData() {
    if (!twin?.twinClassId) return;

    try {
      const resp = await searchTwinClasses({
        filters: {
          headHierarchyChildsForTwinClassSearch: {
            idList: [twin?.twinClassId],
            depth: 1,
          },
        },
      });

      return setTwinClass(resp.data);
    } catch (error) {
      console.error("Failed to fetch twinClass:", error);
    }
  }

  if (isUndefined(twin) || loading) return <LoadingOverlay />;

  return (
    <TwinContext.Provider
      value={{
        twinId,
        twin,
        refresh,
        twinClass,
      }}
    >
      {loading ? <LoadingOverlay /> : children}
    </TwinContext.Provider>
  );
}
