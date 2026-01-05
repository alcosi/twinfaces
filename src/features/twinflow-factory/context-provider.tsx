"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

import {
  TwinFlowFactory_DETAILED,
  useTwinFlowFactoryFetchByIdV1,
} from "@/entities/twinflow-factory";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";

type TwinFlowFactoryContextType = {
  twinflowFactoryId: string;
  twinflowFactory: TwinFlowFactory_DETAILED;
  refresh: () => Promise<void>;
};

export const TwinFlowFactoryContext = createContext<TwinFlowFactoryContextType>(
  {} as TwinFlowFactoryContextType
);

export function TwinFlowFactoryContextProvider({
  twinflowFactoryId,
  children,
}: {
  twinflowFactoryId: string;
  children: ReactNode;
}) {
  const { fetchTwinFlowFactoryById, loading } = useTwinFlowFactoryFetchByIdV1();
  const [twinflowFactory, setTwinflowFactory] = useState<
    TwinFlowFactory_DETAILED | undefined
  >(undefined);

  useEffect(() => {
    refresh();
  }, [twinflowFactoryId]);

  async function refresh() {
    try {
      const response = await fetchTwinFlowFactoryById(twinflowFactoryId);

      if (response) {
        setTwinflowFactory(response);
      }
    } catch (e) {
      console.error("Failed to fetch twinflow factory:", e);
    }
  }

  if (isUndefined(twinflowFactory) || loading) return <LoadingOverlay />;

  return (
    <TwinFlowFactoryContext.Provider
      value={{ twinflowFactoryId, twinflowFactory, refresh }}
    >
      {children}
    </TwinFlowFactoryContext.Provider>
  );
}
