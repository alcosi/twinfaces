import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { Metadata } from "next";
import { PublicEnvScript } from "next-runtime-env";
import { Inter } from "next/font/google";
import React from "react";

import { ThemeProvider } from "@/components/theme-provider";

import { ProjectConfigProvider } from "@/features/project-config-context";
import { projectConfig } from "@/shared/config";
import { cn } from "@/shared/libs";

import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: projectConfig?.title,
  description: projectConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PublicEnvScript />
        <link rel="icon" type="image/svg+xml" href={projectConfig?.favicon} />
      </head>
      <body
        className={cn(
          "min-h-screen fontSans font-sans antialiased overflow-hidden",
          fontSans.variable
        )}
      >
        <ProjectConfigProvider>
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
        </ProjectConfigProvider>
      </body>
    </html>
  );
}
