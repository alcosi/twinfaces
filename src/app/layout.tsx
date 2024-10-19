import { TooltipProvider } from "@/components/base/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ApiContextProvider } from "@/lib/api/api";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/widgets/layouts";
import type { Metadata } from "next";
import { PublicEnvScript } from "next-runtime-env";
import { Inter } from "next/font/google";
import React from "react";
import { Toaster } from "sonner";
import "../styles/globals.css";

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
              <MainLayout>{children}</MainLayout>
            </TooltipProvider>
          </ApiContextProvider>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
