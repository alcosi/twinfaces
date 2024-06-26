import Link from "next/link";
import {ThemeToggle} from "@/components/ThemeToggle";
import {Sheet, SheetContent, SheetFooter, SheetHeader, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Menu, Package2} from "lucide-react";


export function MainLayout({children}: { children: React.ReactNode }) {

    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav
                    className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        Classes
                    </Link>
                    {/*<ThemeToggle/>*/}
                </nav>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5"/>
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Classes
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>

                <div className="flex-1"/>

                <ThemeToggle/>
            </header>
            <main
                className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                {children}
            </main>
        </div>
    )
}