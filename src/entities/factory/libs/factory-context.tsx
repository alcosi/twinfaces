import { Factory_DETAILED, useFetchFactoryData } from "@/entities/factory";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";
import { createContext, ReactNode, useEffect, useState } from "react";

interface FactoryContextProps {
  factoryId: string;
  factory: Factory_DETAILED;
  refresh: () => void;
}

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
  const [loading, setLoading] = useState<boolean>(false);
  const [factory, setFactory] = useState<Factory_DETAILED | undefined>(
    undefined
  );

  useEffect(() => {
    refresh();
  }, []);

  const { refresh } = useFetchFactoryData({
    factoryId,
    setFactory,
    setLoading,
  });

  if (isUndefined(factory) || loading) return <LoadingOverlay />;

  return (
    <FactoryContext.Provider value={{ factoryId, factory, refresh }}>
      {loading ? <LoadingOverlay /> : children}
    </FactoryContext.Provider>
  );
}
