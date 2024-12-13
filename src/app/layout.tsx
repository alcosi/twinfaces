import { ThemeProvider } from "@/components/theme-provider";
import { ApiContextProvider } from "@/features/api-context-provider";
import { cn } from "@/shared/libs";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { Metadata } from "next";
import { PublicEnvScript } from "next-runtime-env";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Twin Faces",
  description: "Admin panel for the Twins framework",
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
        <link rel="icon" type="image/svg+xml" href={"/favicon.svg"} />
      </head>
      <body
        className={cn(
          "min-h-screen fontSans font-sans antialiased overflow-hidden",
          fontSans.variable
        )}
      >
        <ApiContextProvider>
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
        </ApiContextProvider>
      </body>
    </html>
  );
}
