import React from "react";

import { DomainPublicView } from "@/entities/domain";
import { PublicApiContextProvider } from "@/features/api";
import { DomainPublicContextProvider } from "@/features/domain";
import { ThemeProvider } from "@/features/ui/theme-provider";
import { ProductFlavorConfigProvider } from "@/shared/config";
import { ProductFlavorConfig } from "@/shared/config/types";
import { TooltipProvider } from "@/shared/ui";

export function PublicLayoutProviders({
  config,
  children,
  domains,
}: {
  config: ProductFlavorConfig;
  children: React.ReactNode;
  domains: DomainPublicView[];
}) {
  return (
    <ProductFlavorConfigProvider config={config}>
      <DomainPublicContextProvider domains={domains}>
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
      </DomainPublicContextProvider>
    </ProductFlavorConfigProvider>
  );
}
