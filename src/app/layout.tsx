import { TooltipProvider } from "@/components/base/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ApiContextProvider } from "@/feature/api-context-provider";
import { cn } from "@/shared/libs";
import { SidebarLayout } from "@/widgets";
import type { Metadata } from "next";
import { PublicEnvScript } from "next-runtime-env";
import { Inter } from "next/font/google";
import React from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { BreadcrumbProvider } from "@/features/breadcrumb";

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
        {/*<link rel="icon" type="image/png" href={favicon}/>*/}
      </head>
      <body
        className={cn(
          "min-h-screen fontSans font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ApiContextProvider>
            <TooltipProvider>
              <BreadcrumbProvider>
                <SidebarLayout>{children}</SidebarLayout>
              </BreadcrumbProvider>
            </TooltipProvider>
          </ApiContextProvider>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
