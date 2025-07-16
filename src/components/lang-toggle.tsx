"use client";

import * as React from "react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import { useLocale } from "./locale-provider";

export function LanguageToggle() {
  const { locale, changeLocale } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {locale}
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLocale("ru")}>
          ru
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLocale("en")}>
          en
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
