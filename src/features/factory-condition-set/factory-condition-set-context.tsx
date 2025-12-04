import { ReactNode, createContext, useEffect, useState } from "react";

import {
  FactoryConditionSet_DETAILED,
  useFetchFactoryConditionSetById,
} from "@/entities/factory-condition-set";
import { LoadingOverlay } from "@/shared/ui";

type FactoryConditionSetContextType = {
  factoryConditionSet: FactoryConditionSet_DETAILED;
  refresh: () => Promise<void>;
  isLoading: boolean;
};

export const FactoryConditionSetContext =
  createContext<FactoryConditionSetContextType>(
    {} as FactoryConditionSetContextType
  );

export function FactoryConditionSetProvider({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const { fetchFactoryConditionSetById } = useFetchFactoryConditionSetById();
  const [factoryConditionSet, setFactoryConditionSet] =
    useState<FactoryConditionSet_DETAILED | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFactoryConditionSetById(id);
      setFactoryConditionSet(data);
    } catch (error) {
      console.error("Failed to fetch factory condition set:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (isLoading || !factoryConditionSet) {
    return <LoadingOverlay />;
  }

  return (
    <FactoryConditionSetContext.Provider
      value={{
        factoryConditionSet,
        refresh: fetchData,
        isLoading,
      }}
    >
      {isLoading ? <LoadingOverlay /> : children}
    </FactoryConditionSetContext.Provider>
  );
}
