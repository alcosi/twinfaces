"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";

import { RenderOnClient } from "@/shared/ui";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <RenderOnClient>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </RenderOnClient>
  );
}
