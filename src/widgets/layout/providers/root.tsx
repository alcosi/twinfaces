import React from "react";

import { ActionDialogsProvider } from "@/features/ui/action-dialogs";
import { ThemeProvider } from "@/features/ui/theme-provider";
import { ProductFlavorConfigProvider } from "@/shared/config";
import { ProductFlavorConfig } from "@/shared/config/types";

export function RootLayoutProviders({
  config,
  children,
}: {
  config: ProductFlavorConfig;
  children: React.ReactNode;
}) {
  return (
    <ActionDialogsProvider>
      <ProductFlavorConfigProvider config={config}>
        <ThemeProvider
          attribute="class"
          defaultTheme={config.theme.defaultTheme}
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </ProductFlavorConfigProvider>
    </ActionDialogsProvider>
  );
}
