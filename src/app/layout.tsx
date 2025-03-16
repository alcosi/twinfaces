import { TooltipProvider } from "@radix-ui/react-tooltip";
import { PublicEnvScript } from "next-runtime-env";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import React from "react";

import { ThemeProvider } from "@/components/theme-provider";

import { PublicApiContextProvider } from "@/features/api";
import {
  ProductFlavorConfigProvider,
  getProductFlavorConfig,
} from "@/shared/config";
import { cn } from "@/shared/libs";

import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const domainConfigHeader = headers().get("X-Domain-Config");
  const config = getProductFlavorConfig(
    domainConfigHeader ? JSON.parse(domainConfigHeader) : {}
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PublicEnvScript />
        <title>{config.key ?? config.productName}</title>
        <meta
          name="description"
          content={config.description ?? config.productName}
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href={config.iconLight ?? config.favicon}
        />
      </head>
      <body
        className={cn(
          "min-h-screen fontSans font-sans antialiased overflow-hidden",
          fontSans.variable
        )}
      >
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
      </body>
    </html>
  );
}
