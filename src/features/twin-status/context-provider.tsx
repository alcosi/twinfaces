import { ReactNode, createContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { TwinStatusV2, useFetchTwinStatusById } from "@/entities/twin-status";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type TwinStatusContextProps = {
  twinStatusId: string;
  twinStatus: TwinStatusV2;
  refresh: () => Promise<void>;
};

export const TwinStatusContext = createContext<TwinStatusContextProps>(
  {} as TwinStatusContextProps
);

export function TwinStatusContextProvider({
  twinStatusId,
  children,
}: {
  twinStatusId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [twinStatusId]);

  const [twinStatus, setTwinStatus] = useState<TwinStatusV2 | undefined>(
    undefined
  );
  const { fetchTwinStatusById, loading } = useFetchTwinStatusById();

  async function refresh() {
    try {
      const response = await fetchTwinStatusById(twinStatusId);

      if (response) {
        setTwinStatus(response);
      }
    } catch {
      toast.error("Failed to fetch twin status");
    }
  }

  if (isUndefined(twinStatus) || loading) return <LoadingOverlay />;

  return (
    <TwinStatusContext.Provider value={{ twinStatusId, twinStatus, refresh }}>
      {loading ? <LoadingOverlay /> : children}
    </TwinStatusContext.Provider>
  );
}
