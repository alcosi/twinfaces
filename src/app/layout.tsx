import deepmerge from "deepmerge";
import { getLocale, getMessages } from "next-intl/server";
import { PublicEnvScript } from "next-runtime-env";
import { Inter } from "next/font/google";
import React from "react";

import { LocaleProvider } from "@/components/locale-provider";

import { getDomainFromHeaders } from "@/entities/face";
import { getProductFlavorConfig } from "@/shared/config";
import { cn } from "@/shared/libs";
import { PublicLayoutProviders } from "@/widgets/layout";

import "../styles/globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  // NOTE: Set by Tailwind's default theme — see docs: https://tailwindcss.com/docs/theme#default-theme-variable-reference
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const remoteConfig = await getDomainFromHeaders();
  const config = getProductFlavorConfig(remoteConfig);
  const locale = await getLocale();
  const messages = await getMessages();
  const fallbackMessages = await import(`../../messages/en.json`);
  const mergedMessages = deepmerge(fallbackMessages, messages);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PublicEnvScript />
        <title>{config.name ?? config.productName}</title>
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
          "bg-background text-foreground min-h-screen overflow-hidden antialiased",
          fontSans.className
        )}
      >
        <LocaleProvider initialLocale={locale} initialMessages={mergedMessages}>
          <PublicLayoutProviders config={config}>
            {children}
          </PublicLayoutProviders>
        </LocaleProvider>
      </body>
    </html>
  );
}
