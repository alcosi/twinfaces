import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  StatusTrigger_DETAILED,
  useFetchStatusTriggerById,
} from "@/entities/status-trigger";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type StatusTriggerContextProps = {
  statusTriggerId: string;
  statusTrigger: StatusTrigger_DETAILED;
  refresh: () => Promise<void>;
};

export const StatusTriggerContext = createContext<StatusTriggerContextProps>(
  {} as StatusTriggerContextProps
);

export function StatusTriggerContextProvider({
  statusTriggerId,
  children,
}: {
  statusTriggerId: string;
  children: ReactNode;
}) {
  const { fetchStatusTriggerById, isLoading } = useFetchStatusTriggerById();
  const [statusTrigger, setStatusTrigger] = useState<
    StatusTrigger_DETAILED | undefined
  >(undefined);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchStatusTriggerById(statusTriggerId);

      if (result) setStatusTrigger(result);
    } catch (error) {
      console.error("Failed to fetch status trigger:", error);
    }
  }, [statusTriggerId, fetchStatusTriggerById]);

  useEffect(() => {
    refresh();
  }, [statusTriggerId, refresh]);

  if (isUndefined(statusTrigger) || isLoading) return <LoadingOverlay />;

  return (
    <StatusTriggerContext.Provider
      value={{ statusTriggerId, statusTrigger, refresh }}
    >
      {children}
    </StatusTriggerContext.Provider>
  );
}
