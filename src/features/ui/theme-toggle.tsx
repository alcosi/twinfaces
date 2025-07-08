"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { getProductFlavorConfig } from "@/shared/config";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";

const THEME_OPTIONS = [
  { key: "light", icon: Sun },
  { key: "dark", icon: Moon },
  { key: "system", icon: Monitor },
] as const;

export function ThemeToggle() {
  const config = getProductFlavorConfig();
  const { setTheme, theme = config.theme.defaultTheme } = useTheme();

  const CurrentThemeIcon = (
    THEME_OPTIONS.find((option) => option.key === theme) ?? THEME_OPTIONS[0]
  ).icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <CurrentThemeIcon />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-10 min-w-0 space-y-1 p-0">
        {THEME_OPTIONS.map(({ key, icon: Icon }) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(key)}
            className="cursor-pointer"
          >
            <Icon />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
