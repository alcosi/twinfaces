import { Factory_DETAILED, useFetchFactoryData } from "@/entities/factory";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";
import { createContext, ReactNode, useEffect } from "react";

type FactoryContextProps = {
  factoryId: string;
  factory: Factory_DETAILED;
  fetchFactoryById: () => void;
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
    fetchFactoryById();
  }, []);

  const { fetchFactoryById, loading, factory } = useFetchFactoryData({
    factoryId,
  });

  if (isUndefined(factory) || loading) return <LoadingOverlay />;

  return (
    <FactoryContext.Provider value={{ factoryId, factory, fetchFactoryById }}>
      {loading ? <LoadingOverlay /> : children}
    </FactoryContext.Provider>
  );
}
