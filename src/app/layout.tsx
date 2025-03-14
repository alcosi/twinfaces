import { TooltipProvider } from "@radix-ui/react-tooltip";
import { PublicEnvScript, env } from "next-runtime-env";
import { Inter } from "next/font/google";
import React from "react";

import { ThemeProvider } from "@/components/theme-provider";

import { PublicApiContextProvider } from "@/features/api";
import {
  ProductFlavorConfigProvider,
  RemoteConfig,
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
  async function fetchDomainByKey(key: string) {
    const response = await fetch(
      `${env("NEXT_PUBLIC_TWINS_API_URL")}/public/domain_by_key/${key}/v1?showDomainMode=DETAILED`
      //  { cache: 'no-cache' }
    );

    const body = await response.json();
    return body.domain;
  }

  const domain: RemoteConfig = await fetchDomainByKey("wnr");
  const config = getProductFlavorConfig(domain);

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
