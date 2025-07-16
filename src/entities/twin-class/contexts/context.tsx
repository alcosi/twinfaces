import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { TwinClass, useFetchTwinClassById } from "@/entities/twin-class";
import { isErrorInstance, isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";

interface TwinClassContextProps {
  twinClassId: string;
  twinClass: TwinClass;
  refresh: () => void;
}

export type TwinClassLayoutProps = PropsWithChildren<{
  params: Pick<TwinClassContextProps, "twinClassId">;
}>;

export const TwinClassContext = createContext<TwinClassContextProps>(
  {} as TwinClassContextProps
);

export function TwinClassContextProvider({
  params: { twinClassId },
  children,
}: TwinClassLayoutProps) {
  const { fetchTwinClassById, loading } = useFetchTwinClassById();
  const [twinClass, setTwinClass] = useState<TwinClass | undefined>(undefined);

  useEffect(() => {
    refresh();
  }, [twinClassId]);

  async function refresh() {
    try {
      const response = await fetchTwinClassById({
        id: twinClassId,
        query: {
          showTwinClassMode: "MANAGED",
          showTwin2TwinClassMode: "MANAGED",
          showTwinClassHead2TwinClassMode: "MANAGED",
          showTwinClassExtends2TwinClassMode: "DETAILED",
          showTwinClass2LinkMode: "DETAILED",
          showLinkDst2TwinClassMode: "DETAILED",
          showTwinClassFieldDescriptor2DataListOptionMode: "DETAILED",
          showTwinClassMarker2DataListOptionMode: "DETAILED",
          showTwinClassTag2DataListOptionMode: "DETAILED",
          showTwinClass2PermissionMode: "DETAILED",
          lazyRelation: false,
        },
      });

      setTwinClass(response);
    } catch (e) {
      toast.error(isErrorInstance(e) ? e.message : String(e));
    }
  }

  if (isUndefined(twinClass) || loading) return <LoadingOverlay />;

  return (
    <TwinClassContext.Provider
      value={{
        twinClassId,
        twinClass,
        refresh,
      }}
    >
      {loading ? <LoadingOverlay /> : children}
    </TwinClassContext.Provider>
  );
}
