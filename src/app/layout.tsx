import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "../styles/globals.css";
import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "sonner";
import {MainLayout} from "@/components/layout/main-layout";
import {PublicEnvScript} from "next-runtime-env";
import {ApiContextProvider} from "@/lib/api/api";

import favicon from "@/assets/img/face.svg";
import {TooltipProvider} from "@/components/base/tooltip";

const fontSans = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Twin Faces",
    description: "Admin panel for the Twins framework"
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <PublicEnvScript/>
            <link rel="icon" type="image/svg+xml" href={'/favicon.svg'}/>
            {/*<link rel="icon" type="image/png" href={favicon}/>*/}
        </head>
        <body className={cn(
            "min-h-screen fontSans font-sans antialiased",
            fontSans.variable
        )}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <ApiContextProvider>
                <TooltipProvider>
                    <MainLayout>
                        {children}
                    </MainLayout>
                </TooltipProvider>
            </ApiContextProvider>

            <Toaster/>
        </ThemeProvider>
        </body>
        </html>
    );
}
