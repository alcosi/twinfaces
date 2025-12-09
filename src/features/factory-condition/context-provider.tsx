import { ReactNode, createContext, useEffect, useState } from "react";

import {
  FactoryCondition_DETAILED,
  useFetchFactoryConditionById,
} from "@/entities/factory-condition";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type FactoryConditionContextProps = {
  factoryConditionId: string;
  factoryCondition: FactoryCondition_DETAILED;
  refresh: () => Promise<void>;
};

export const FactoryConditionContext =
  createContext<FactoryConditionContextProps>(
    {} as FactoryConditionContextProps
  );

export function FactoryConditionContextProvider({
  factoryConditionId,
  children,
}: {
  factoryConditionId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [factoryConditionId]);

  const [factoryCondition, setFactoryCondition] = useState<
    FactoryCondition_DETAILED | undefined
  >(undefined);
  const { fetchFactoryConditionById, isLoading } =
    useFetchFactoryConditionById();

  async function refresh() {
    try {
      const fetchFactoryCondition =
        await fetchFactoryConditionById(factoryConditionId);

      if (fetchFactoryCondition) {
        setFactoryCondition(fetchFactoryCondition);
      }
    } catch (error) {
      console.error("Failed to fetch factory condition:", error);
    }
  }

  if (isUndefined(factoryCondition) || isLoading) return <LoadingOverlay />;

  return (
    <FactoryConditionContext.Provider
      value={{ factoryConditionId, factoryCondition, refresh }}
    >
      {isLoading ? <LoadingOverlay /> : children}
    </FactoryConditionContext.Provider>
  );
}
