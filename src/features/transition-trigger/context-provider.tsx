import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import {
  TransitionTrigger_DETAILED,
  useFetchTransitionTriggerById,
} from "@/entities/transition-trigger";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type TransitionTriggerContextType = {
  id: string;
  transitionTrigger: TransitionTrigger_DETAILED;
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
  const { fetchTransitionTriggerById, isLoading } =
    useFetchTransitionTriggerById();
  const [transitionTrigger, setTransitionTrigger] = useState<
    TransitionTrigger_DETAILED | undefined
  >(undefined);

  const refresh = useCallback(async () => {
    try {
      const response = await fetchTransitionTriggerById(id);

      if (response) {
        setTransitionTrigger(response);
      }
    } catch {
      toast.error("Failed to fetch transition trigger");
    }
  }, [id, fetchTransitionTriggerById]);

  useEffect(() => {
    refresh();
  }, [id, refresh]);

  if (isUndefined(transitionTrigger) || isLoading) return <LoadingOverlay />;

  return (
    <TransitionTriggerContext.Provider
      value={{ id, transitionTrigger, refresh }}
    >
      {children}
    </TransitionTriggerContext.Provider>
  );
}
