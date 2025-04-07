"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const icons = {
    light: (
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    ),
    dark: (
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    ),
    system: <Monitor className="h-[1.2rem] w-[1.2rem] cursor-pointer" />,
  };
  const selectedIcon = icons[theme as keyof typeof icons] ?? icons.light;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          {selectedIcon}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0 mt-0 p-0 space-y-1">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="h-[1.2rem] w-[1.2rem] cursor-pointer" />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="h-[1.2rem] w-[1.2rem] cursor-pointer" />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="h-[1.2rem] w-[1.2rem] cursor-pointer" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
