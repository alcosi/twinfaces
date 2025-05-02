import { PublicEnvScript } from "next-runtime-env";
import { Inter } from "next/font/google";
import React from "react";

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
  const config = getProductFlavorConfig();

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
          "min-h-screen overflow-hidden bg-background text-foreground antialiased",
          fontSans.className
        )}
      >
        <PublicLayoutProviders config={config}>
          {children}
        </PublicLayoutProviders>
      </body>
    </html>
  );
}
