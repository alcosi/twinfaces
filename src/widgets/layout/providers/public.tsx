import React from "react";
import { Toaster } from "sonner";

import { PublicApiContextProvider } from "@/features/api";
import { ActionDialogsProvider } from "@/features/ui/action-dialogs";
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
    <ActionDialogsProvider>
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
          <Toaster />
        </PublicApiContextProvider>
      </ProductFlavorConfigProvider>
    </ActionDialogsProvider>
  );
}
