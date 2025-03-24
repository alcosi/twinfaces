import { PublicEnvScript } from "next-runtime-env";
import { Inter } from "next/font/google";
import React from "react";

import { getDomainFromHeaders } from "@/entities/face";
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
  const config = getProductFlavorConfig(domainInfo);

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
        <PublicLayoutProviders config={config}>
          {children}
        </PublicLayoutProviders>
      </body>
    </html>
  );
}
