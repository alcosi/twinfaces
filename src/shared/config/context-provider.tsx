"use client";

import { ReactNode, createContext, useContext } from "react";

import { isUndefined } from "../libs";
import { LoadingOverlay } from "../ui";
import { ProductFlavorConfig } from "./types";

const ProductFlavorConfigContext = createContext<ProductFlavorConfig>(
  {} as any
);

export function useProductFlavorConfig() {
  const config = useContext(ProductFlavorConfigContext);

  return config;
}

export function ProjectConfigProvider({
  children,
  config,
}: {
  children: ReactNode;
  config: ProductFlavorConfig;
}) {
  if (isUndefined(config)) <LoadingOverlay />;

  return (
    <ProductFlavorConfigContext.Provider value={config}>
      {children}
    </ProductFlavorConfigContext.Provider>
  );
}
