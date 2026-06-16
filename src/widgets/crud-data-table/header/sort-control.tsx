"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Check } from "lucide-react";

import { SortV1 } from "@/shared/api";
import { cn } from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";

/** A single field the dataset can be sorted by. */
export type SortableFieldOption = {
  /** Server sort field (matches the search endpoint's `sortField`). */
  field: string;
  /** Human-readable label shown in the menu. */
  label: string;
};

type SortControlProps = {
  fields: SortableFieldOption[];
  sort?: SortV1;
  onSortChange: (sort: SortV1 | undefined) => void;
};

/**
 * Toolbar sort control for layouts that have no clickable column headers (the
 * card view). Selecting a field cycles ASC → DESC → off, mirroring
 * {@link SortableHeader} so both affordances drive the same sort state.
 */
export function SortControl({ fields, sort, onSortChange }: SortControlProps) {
  const active = fields.find((f) => f.field === sort?.field);

  function cycle(field: string) {
    if (sort?.field !== field || !sort?.direction) {
      onSortChange({ field, direction: "ASC" });
    } else if (sort.direction === "ASC") {
      onSortChange({ field, direction: "DESC" });
    } else {
      onSortChange(undefined);
    }
  }

  const DirectionIcon =
    active && sort?.direction === "DESC" ? ArrowDown : ArrowUp;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          {active ? (
            <DirectionIcon className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
          <span className="text-sm">
            {active ? `Sort: ${active.label}` : "Sort"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {fields.map((option) => {
          const isActive = option.field === sort?.field && !!sort?.direction;
          return (
            <DropdownMenuItem
              key={option.field}
              onSelect={(event) => {
                // Keep the menu open so the user can flip the direction with a
                // second click without re-opening it.
                event.preventDefault();
                cycle(option.field);
              }}
              className="flex items-center justify-between gap-4"
            >
              <span>{option.label}</span>
              {isActive ? (
                sort?.direction === "ASC" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )
              ) : (
                <Check className={cn("h-4 w-4 opacity-0")} />
              )}
            </DropdownMenuItem>
          );
        })}
        {active && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onSortChange(undefined)}>
              Clear sorting
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
