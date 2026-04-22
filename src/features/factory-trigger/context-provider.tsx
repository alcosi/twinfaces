"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

import {
  FactoryTrigger_DETAILED,
  useFetchFactoryTriggerById,
} from "@/entities/factory-trigger";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type FactoryTriggerContextProps = {
  factoryTriggerId: string;
  factoryTrigger: FactoryTrigger_DETAILED;
  refresh: () => Promise<void>;
};

export const FactoryTriggerContext = createContext<FactoryTriggerContextProps>(
  {} as FactoryTriggerContextProps
);
export function FactoryTriggerContextProvider({
  factoryTriggerId,
  children,
}: {
  factoryTriggerId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [factoryTriggerId]);

  const [factoryTrigger, setFactoryTrigger] = useState<
    FactoryTrigger_DETAILED | undefined
  >(undefined);

  const { fetchFactoryTriggerById, loading } = useFetchFactoryTriggerById();

  async function refresh() {
    try {
      const fetchFactoryTrigger =
        await fetchFactoryTriggerById(factoryTriggerId);

      if (fetchFactoryTrigger) {
        setFactoryTrigger(fetchFactoryTrigger);
      }
    } catch (error) {
      console.error("Failed to fetch factory trigger:", error);
    }
  }

  if (isUndefined(factoryTrigger) || loading) return <LoadingOverlay />;

  return (
    <FactoryTriggerContext.Provider
      value={{ factoryTriggerId, factoryTrigger, refresh }}
    >
      {loading ? <LoadingOverlay /> : children}
    </FactoryTriggerContext.Provider>
  );
}
