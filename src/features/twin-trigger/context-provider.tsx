import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  TwinTrigger_DETAILED,
  useFetchTwinTriggerById,
} from "@/entities/twin-trigger";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type TwinTriggerContexProps = {
  twinTriggerId: string;
  twinTrigger: TwinTrigger_DETAILED;
  refresh: () => Promise<void>;
};

export const TwinTriggerContext = createContext<TwinTriggerContexProps>(
  {} as TwinTriggerContexProps
);

export function TwinTriggerContextProvider({
  twinTriggerId,
  children,
}: {
  twinTriggerId: string;
  children: ReactNode;
}) {
  const { fetchTwinTriggerById, isLoading } = useFetchTwinTriggerById();
  const [twinTrigger, setTwinTrigger] = useState<
    TwinTrigger_DETAILED | undefined
  >(undefined);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchTwinTriggerById(twinTriggerId);

      if (result) setTwinTrigger(result);
    } catch (error) {
      console.error("Failed to fetch twin trigger:", error);
    }
  }, [twinTriggerId, fetchTwinTriggerById]);

  useEffect(() => {
    refresh();
  }, [twinTriggerId, refresh]);

  if (isUndefined(twinTrigger) || isLoading) return <LoadingOverlay />;

  return (
    <TwinTriggerContext.Provider
      value={{ twinTrigger, twinTriggerId, refresh }}
    >
      {children}
    </TwinTriggerContext.Provider>
  );
}
