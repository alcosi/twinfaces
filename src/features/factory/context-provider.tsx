import { ReactNode, createContext, useEffect, useState } from "react";

import { Factory_DETAILED, useFetchFactoryById } from "@/entities/factory";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type FactoryContextProps = {
  factoryId: string;
  factory: Factory_DETAILED;
  refresh: () => Promise<void>;
};

export const FactoryContext = createContext<FactoryContextProps>(
  {} as FactoryContextProps
);

export function FactoryContextProvider({
  factoryId,
  children,
}: {
  factoryId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [factoryId]);

  const [factory, setFactory] = useState<Factory_DETAILED | undefined>(
    undefined
  );
  const { fetchFactoryById, loading } = useFetchFactoryById();

  async function refresh() {
    try {
      const fetchedFactory = await fetchFactoryById(factoryId);
      if (fetchedFactory) {
        setFactory(fetchedFactory);
      }
    } catch (error) {
      console.error("Failed to fetch factory:", error);
    }
  }

  if (isUndefined(factory) || loading) return <LoadingOverlay />;

  return (
    <FactoryContext.Provider value={{ factoryId, factory, refresh }}>
      {loading ? <LoadingOverlay /> : children}
    </FactoryContext.Provider>
  );
}
