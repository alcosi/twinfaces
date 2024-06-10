import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "../styles/globals.css";
import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/ThemeProvider";
import {Toaster} from "sonner";
import {MainLayout} from "@/components/ui/main-layout";
import {PublicEnvScript} from "next-runtime-env";
import {ApiContextProvider} from "@/lib/api/api";

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
        <html lang="en">
        <head>
            <PublicEnvScript/>
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
                <MainLayout>
                    {children}
                </MainLayout>
            </ApiContextProvider>

            <Toaster/>
        </ThemeProvider>
        </body>
        </html>
    );
}
