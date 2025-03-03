import { ReactNode, createContext, useEffect, useState } from "react";

import {
  FactoryMultiplier_DETAILED,
  useFetchFactoryMultiplierById,
} from "@/entities/factory-multiplier";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type FactoryMultiplierContextProps = {
  factoryMultiplierId: string;
  factoryMultiplier: FactoryMultiplier_DETAILED;
  refresh: () => Promise<void>;
};

export const FactoryMultiplierContext =
  createContext<FactoryMultiplierContextProps>(
    {} as FactoryMultiplierContextProps
  );

export function FactoryMultiplierContextProvider({
  factoryMultiplierId,
  children,
}: {
  factoryMultiplierId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [factoryMultiplierId]);

  const [factoryMultiplier, setFactoryMultiplier] = useState<
    FactoryMultiplier_DETAILED | undefined
  >(undefined);
  const { fetchFactoryMultiplierById, loading } =
    useFetchFactoryMultiplierById();

  async function refresh() {
    try {
      const fetchFactoryMultiplier =
        await fetchFactoryMultiplierById(factoryMultiplierId);

      if (fetchFactoryMultiplier) {
        setFactoryMultiplier(fetchFactoryMultiplier);
      }
    } catch (error) {
      console.error("Failed to fetch factory multiplier:", error);
    }
  }

  if (isUndefined(factoryMultiplier) || loading) return <LoadingOverlay />;

  return (
    <FactoryMultiplierContext.Provider
      value={{ factoryMultiplierId, factoryMultiplier, refresh }}
    >
      {loading ? <LoadingOverlay /> : children}
    </FactoryMultiplierContext.Provider>
  );
}
