import { LoadingOverlay } from "@/shared/ui/loading";
import { TwinFlow, useTwinFlowSearchV1 } from "@/entities/twinFlow";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

type TwinFlowContextType = {
  twinClassId: string;
  twinFlow?: TwinFlow;
};

export type TwinFlowLayoutProps = PropsWithChildren<{
  params: Pick<TwinFlowContextType, "twinClassId">;
}>;

export const TwinFlowContext = createContext<TwinFlowContextType>(
  {} as TwinFlowContextType
);

export function TwinFlowContextProvider({
  params: { twinClassId },
  children,
}: TwinFlowLayoutProps) {
  const { searchTwinFlows } = useTwinFlowSearchV1();
  const [loading, setLoading] = useState<boolean>(false);
  const [twinFlow, setTwinFlow] = useState<TwinFlow | undefined>(undefined);

  useEffect(() => {
    fetchData();
  }, [twinClassId]);

  async function fetchData() {
    setLoading(true);
    try {
      const response = await searchTwinFlows({
        pagination: {
          pageIndex: 0,
          pageSize: 1,
        },
        filters: { twinClassIdList: [twinClassId] },
      });
      const twinFlows = response.data ?? [];
      setTwinFlow(twinFlows[0]);
    } catch (e) {
      console.error("Failed to fetch twin flows", e);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return (
    <TwinFlowContext.Provider value={{ twinClassId, twinFlow }}>
      {loading && <LoadingOverlay />}
      {!loading && children}
    </TwinFlowContext.Provider>
  );
}
