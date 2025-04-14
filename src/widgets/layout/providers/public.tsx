import React from "react";

import { PublicApiContextProvider } from "@/features/api";
import { ThemeProvider } from "@/features/ui/theme-provider";
import { ProductFlavorConfigProvider } from "@/shared/config";
import { ProductFlavorConfig } from "@/shared/config/types";
import { TooltipProvider } from "@/shared/ui";

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
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={700} skipDelayDuration={0}>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </PublicApiContextProvider>
    </ProductFlavorConfigProvider>
  );
}
