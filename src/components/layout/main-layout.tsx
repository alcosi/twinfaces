import TwinFace from "@/assets/img/face.svg";
import { Button } from "@/components/base/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/base/sheet";
import { PathLink } from "@/components/layout/layout-link";
import { PathLinkMode } from "@/components/layout/layoutlink.common";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const links = [
  {
    href: "/twinclass",
    name: "Classes",
  },
  {
    href: "/twin",
    name: "Twins",
  },
  {
    href: "/permission",
    name: "Permissions",
  },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 h-full">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold md:text-lg"
          >
            <Image src={TwinFace} alt="" className="h-6 w-6 dark:invert" />
            Twin Faces
          </Link>

          {links.map((link) => (
            <PathLink
              key={link.href}
              href={link.href}
              mode={PathLinkMode.StartsWith}
              className="flex items-center gap-2 text-lg font-semibold md:text-base h-full mx-2 pt-1"
              enabledClassName=" border-b-2 border-b-foreground"
              disabledClassName="text-muted-foreground hover:text-foreground"
            >
              {/*{link.icon && <Image src={link.icon} alt='' className="h-6 w-6 dark:invert"/>}*/}
              {link.name}
            </PathLink>
          ))}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-semibold md:text-lg"
              >
                <Image src={TwinFace} alt="" className="h-6 w-6 dark:invert" />
                Twin Faces
              </Link>

              {links.map((link) => (
                <PathLink
                  key={link.href}
                  href={link.href}
                  mode={PathLinkMode.StartsWith}
                  className="flex items-center gap-2"
                  disabledClassName="text-muted-foreground hover:text-foreground"
                >
                  {/*{link.icon && <Image src={link.icon} alt='' className="h-6 w-6 dark:invert"/>}*/}
                  {link.name}
                </PathLink>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex-1" />

        <ThemeToggle />
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        {children}
      </main>
    </div>
  );
}
