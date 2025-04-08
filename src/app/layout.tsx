import { PublicEnvScript } from "next-runtime-env";
import { Inter } from "next/font/google";
import React from "react";

import { fetchDomains } from "@/entities/domain";
import { getDomainFromHeaders, getDomainIdFromCookies } from "@/entities/face";
import { getProductFlavorConfig } from "@/shared/config";
import { cn } from "@/shared/libs";
import { PublicLayoutProviders } from "@/widgets/layout";

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
  const domainInfo = await getDomainFromHeaders();
  const domainIdFromCookie = await getDomainIdFromCookies();
  const config = getProductFlavorConfig(domainInfo);
  const domains = await fetchDomains();

  const selectedDomain = domains.domains?.find(
    (item) => item.id === domainIdFromCookie
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PublicEnvScript />
        <title>{selectedDomain?.key ?? config.key ?? config.productName}</title>
        <meta
          name="description"
          content={
            selectedDomain?.description ??
            config.description ??
            config.productName
          }
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href={selectedDomain?.iconLight ?? config.iconLight ?? config.favicon}
        />
      </head>
      <body
        className={cn(
          "min-h-screen fontSans font-sans antialiased overflow-hidden",
          fontSans.variable
        )}
      >
        <PublicLayoutProviders config={config} domains={domains.domains ?? []}>
          {children}
        </PublicLayoutProviders>
      </body>
    </html>
  );
}
