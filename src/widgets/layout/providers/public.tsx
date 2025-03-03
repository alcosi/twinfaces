import React from "react";

import { PublicApiContextProvider } from "@/features/api";
import { ThemeProvider } from "@/features/ui/theme-provider";
import { ProductFlavorConfigProvider } from "@/shared/config";
import { ProductFlavorConfig } from "@/shared/config/types";

export function PublicLayoutProviders({
  config,
  children,
}: {
  config: ProductFlavorConfig;
  children: React.ReactNode;
}) {
  return (
    <ProductFlavorConfigProvider config={config}>
      <PublicApiContextProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme={config.theme.defaultTheme}
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </PublicApiContextProvider>
    </ProductFlavorConfigProvider>
  );
}
