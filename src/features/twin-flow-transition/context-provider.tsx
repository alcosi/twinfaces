import { ReactNode, createContext, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  TwinFlowTransition_DETAILED,
  useFetchTwinFlowTransitionById,
} from "@/entities/twin-flow-transition";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type TwinFlowTransitionContextProps = {
  transitionId: string;
  transition: TwinFlowTransition_DETAILED;
  refresh: () => Promise<void>;
};

export const TwinFlowTransitionContext =
  createContext<TwinFlowTransitionContextProps>(
    {} as TwinFlowTransitionContextProps
  );

export function TwinFlowTransitionContextProvider({
  transitionId,
  children,
}: {
  transitionId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [transitionId]);

  const [transition, setTransition] = useState<
    TwinFlowTransition_DETAILED | undefined
  >(undefined);
  const { fetchTwinFlowTransitionById, loading } =
    useFetchTwinFlowTransitionById();

  async function refresh() {
    try {
      const response = await fetchTwinFlowTransitionById(transitionId);

      if (response) {
        setTransition(response);
      }
    } catch {
      toast.error("Failed to fetch twin flow transition:");
    }
  }

  if (isUndefined(transition) || loading) return <LoadingOverlay />;

  return (
    <TwinFlowTransitionContext.Provider
      value={{ transitionId, transition, refresh }}
    >
      {loading ? <LoadingOverlay /> : children}
    </TwinFlowTransitionContext.Provider>
  );
}
