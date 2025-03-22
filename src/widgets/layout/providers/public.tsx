import React from "react";

import { ThemeProvider } from "@/components/theme-provider";

import { PublicApiContextProvider } from "@/features/api";
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
          defaultTheme="system"
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
