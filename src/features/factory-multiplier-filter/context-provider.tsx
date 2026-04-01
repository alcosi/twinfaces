import { ReactNode, createContext, useEffect, useState } from "react";

import {
  FactoryMultiplierFilter_DETAILED,
  useFetchFactoryMultiplierFilterById,
} from "@/entities/factory-multiplier-filter";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type FactoryMultiplierFilterContextProps = {
  factoryMultiplierFilterId: string;
  factoryMultiplierFilter: FactoryMultiplierFilter_DETAILED;
  refresh: () => Promise<void>;
};

export const FactoryMultiplierFilterContext =
  createContext<FactoryMultiplierFilterContextProps>(
    {} as FactoryMultiplierFilterContextProps
  );

export function FactoryMultiplierFilterContextProvider({
  factoryMultiplierFilterId,
  children,
}: {
  factoryMultiplierFilterId: string;
  children: ReactNode;
}) {
  const [factoryMultiplierFilter, setFactoryMultiplierFilter] = useState<
    FactoryMultiplierFilter_DETAILED | undefined
  >(undefined);
  const { fetchFactoryMultiplierFilterById, loading } =
    useFetchFactoryMultiplierFilterById();
  useEffect(() => {
    refresh();
  }, [factoryMultiplierFilterId]);

  async function refresh() {
    try {
      const fetchFactoryMultiplierFilter =
        await fetchFactoryMultiplierFilterById(factoryMultiplierFilterId);

      if (fetchFactoryMultiplierFilter) {
        setFactoryMultiplierFilter(fetchFactoryMultiplierFilter);
      }
    } catch (error) {
      console.error("Failed to fetch factory multiplier filter:", error);
    }
  }

  if (isUndefined(factoryMultiplierFilter) || loading)
    return <LoadingOverlay />;

  return (
    <FactoryMultiplierFilterContext.Provider
      value={{ factoryMultiplierFilterId, factoryMultiplierFilter, refresh }}
    >
      {loading ? <LoadingOverlay /> : children}
    </FactoryMultiplierFilterContext.Provider>
  );
}
