"use client";

import { ReactNode, createContext, useContext } from "react";

import { DomainPublicView } from "@/entities/domain";

type DomainPublicContextProps = {
  domains: DomainPublicView[];
};

const DomainPublicContext = createContext<DomainPublicContextProps | null>(
  null
);

export function DomainPublicContextProvider({
  domains,
  children,
}: {
  domains: DomainPublicView[];
  children: ReactNode;
}) {
  return (
    <DomainPublicContext.Provider value={{ domains }}>
      {children}
    </DomainPublicContext.Provider>
  );
}

export function useDomainPublic() {
  const context = useContext(DomainPublicContext);

  if (!context) {
    throw new Error(
      `useDomainPublic must be used within DomainPublicContextProvider`
    );
  }

  return context;
}
