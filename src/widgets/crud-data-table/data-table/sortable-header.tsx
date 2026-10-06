"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { cn } from "@/shared/libs";

import { useSortContext } from "./sort-context";

type SortableHeaderProps = {
  title: string;
  sortField: string;
};

export function SortableHeader({ title, sortField }: SortableHeaderProps) {
  const { sort, onSortChange } = useSortContext();

  const isActive = sort?.field === sortField;
  const isAsc = isActive && sort?.direction === "ASC";
  const isDesc = isActive && sort?.direction === "DESC";

  function handleClick() {
    if (!isActive || !sort?.direction) {
      onSortChange({ field: sortField, direction: "ASC" });
    } else if (isAsc) {
      onSortChange({ field: sortField, direction: "DESC" });
    } else {
      onSortChange(undefined);
    }
  }

  return (
    <button
      // The arrow sits in reserved right padding; centered headers mirror it
      // on the left so the title lines up with the column's center.
      className="group/header hover:text-foreground relative inline-flex items-center pr-4.5 [text-align:inherit] group-data-centered/header-label:pl-4.5"
      onClick={handleClick}
    >
      <span>{title}</span>
      <span
        className={cn(
          "absolute top-1/2 right-0 inline-flex -translate-y-1/2 transition-opacity",
          isActive ? "opacity-100" : "opacity-0 group-hover/header:opacity-50"
        )}
      >
        {isAsc ? (
          <ArrowUp className="h-3.5 w-3.5" />
        ) : isDesc ? (
          <ArrowDown className="h-3.5 w-3.5" />
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5" />
        )}
      </span>
    </button>
  );
}
