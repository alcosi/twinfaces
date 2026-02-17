"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

import {
  TwinClassDynamicMarker_DETAILED,
  useTwinClassDynamicMarkerFetchByIdV1,
} from "@/entities/twin-class";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";

type TwinClassDynamicMarkerContextType = {
  dynamicMarkerId: string;
  dynamicMarker: TwinClassDynamicMarker_DETAILED;
  refresh: () => Promise<void>;
};

export const TwinClassDynamicMarkerContext =
  createContext<TwinClassDynamicMarkerContextType>(
    {} as TwinClassDynamicMarkerContextType
  );

export function TwinClassDynamicMarkerContextProvider({
  dynamicMarkerId,
  children,
}: {
  dynamicMarkerId: string;
  children: ReactNode;
}) {
  const { fetchTwinClassDynamicMarkerById, loading } =
    useTwinClassDynamicMarkerFetchByIdV1();
  const [dynamicMarker, setDynamicMarker] = useState<
    TwinClassDynamicMarker_DETAILED | undefined
  >(undefined);

  useEffect(() => {
    refresh();
  }, [dynamicMarkerId]);

  async function refresh() {
    try {
      const response = await fetchTwinClassDynamicMarkerById(dynamicMarkerId);

      if (response) {
        setDynamicMarker(response);
      }
    } catch (e) {
      console.error("Failed to fetch twin class dynamic marker:", e);
    }
  }

  if (isUndefined(dynamicMarker) || loading) return <LoadingOverlay />;

  return (
    <TwinClassDynamicMarkerContext.Provider
      value={{ dynamicMarkerId, dynamicMarker, refresh }}
    >
      {children}
    </TwinClassDynamicMarkerContext.Provider>
  );
}
