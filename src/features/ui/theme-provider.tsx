"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

import { RenderOnClient } from "@/shared/ui";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <RenderOnClient>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </RenderOnClient>
  );
}
