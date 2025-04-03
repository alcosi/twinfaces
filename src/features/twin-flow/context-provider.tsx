"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { TwinFlow, useTwinFlowFetchByIdV1 } from "@/entities/twin-flow";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";

type TwinFlowContextType = {
  twinFlowId: string;
  twinFlow: TwinFlow;
  refresh: () => Promise<void>;
};

export const TwinFlowContext = createContext<TwinFlowContextType>(
  {} as TwinFlowContextType
);

export function TwinFlowContextProvider({
  twinFlowId,
  children,
}: {
  twinFlowId: string;
  children: ReactNode;
}) {
  const { fetchTwinFlowById, loading } = useTwinFlowFetchByIdV1();
  const [twinFlow, setTwinFlow] = useState<TwinFlow | undefined>(undefined);

  useEffect(() => {
    refresh();
  }, [twinFlowId]);

  async function refresh() {
    try {
      const response = await fetchTwinFlowById(twinFlowId);

      if (response) {
        setTwinFlow(response);
      }
    } catch (e) {
      toast.error("Failed to fetch twin flow");
    }
  }

  if (isUndefined(twinFlow) || loading) return <LoadingOverlay />;

  return (
    <TwinFlowContext.Provider value={{ twinFlowId, twinFlow, refresh }}>
      {children}
    </TwinFlowContext.Provider>
  );
}
