import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

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
  const [factoryCondition, setFactoryCondition] = useState<
    FactoryCondition_DETAILED | undefined
  >(undefined);

  const { fetchFactoryConditionById, isLoading } =
    useFetchFactoryConditionById();

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [factoryConditionId]);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchFactoryConditionById(factoryConditionId);
      if (result) setFactoryCondition(result);
    } catch (err) {
      console.error("Failed to fetch factory condition:", err);
    }
  }, [factoryConditionId, fetchFactoryConditionById]);

  if (isUndefined(factoryCondition) || isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <FactoryConditionContext.Provider
      value={{ factoryConditionId, factoryCondition, refresh }}
    >
      {children}
    </FactoryConditionContext.Provider>
  );
}
