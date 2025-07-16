"use client";

import { ReactNode, createContext } from "react";

import { ProductFlavorConfig } from "./types";

export const ProductFlavorConfigContext = createContext<ProductFlavorConfig>(
  {} as ProductFlavorConfig
);

export function ProductFlavorConfigProvider({
  children,
  config,
}: {
  children: ReactNode;
  config: ProductFlavorConfig;
}) {
  return (
    <ProductFlavorConfigContext.Provider value={config}>
      {children}
    </ProductFlavorConfigContext.Provider>
  );
}
