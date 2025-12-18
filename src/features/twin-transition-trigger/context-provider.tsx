import { ReactNode, createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { isUndefined } from "util";

import {
  TwinFlowTransitionTrigger_DETAILED,
  useFetchTransitionTriggerById,
} from "@/entities/twin-flow-transition";
import { LoadingOverlay } from "@/shared/ui";

type TransitionTriggerContextType = {
  id: string;
  transitionTrigger: TwinFlowTransitionTrigger_DETAILED;
  refresh: () => Promise<void>;
};

export const TransitionTriggerContext =
  createContext<TransitionTriggerContextType>(
    {} as TransitionTriggerContextType
  );

export function TransitionTriggerProvider({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [id]);
  const { fetchTransitionTriggerById, loading } =
    useFetchTransitionTriggerById();
  const [transitionTrigger, setTransitionTrigger] = useState<
    TwinFlowTransitionTrigger_DETAILED | undefined
  >(undefined);
  async function refresh() {
    try {
      const response = await fetchTransitionTriggerById(id);

      if (response) {
        setTransitionTrigger(response);
      }
    } catch {
      toast.error("Failed to fetch transition trigger:");
    }
  }

  if (isUndefined(transitionTrigger) || loading) return <LoadingOverlay />;

  return (
    <TransitionTriggerContext.Provider
      value={{
        id,
        transitionTrigger,
        refresh,
      }}
    >
      {children}
    </TransitionTriggerContext.Provider>
  );
}
