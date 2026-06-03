import { ElementType } from "react";

import { cn } from "@/shared/libs";

export type ViewMode = "grid" | "list" | "chart";

export type ViewModeOption = {
  value: ViewMode;
  label: string;
  icon: ElementType;
};

interface ViewModeToggleProps {
  value: ViewMode;
  options: ViewModeOption[];
  onChange: (value: ViewMode) => void;
}

/** Segmented control switching between table, card and pie-chart views. */
export function ViewModeToggle({
  value,
  options,
  onChange,
}: ViewModeToggleProps) {
  return (
    <div
      role="tablist"
      className="border-input inline-flex items-center gap-0.5 rounded-md border p-0.5"
    >
      {options.map((option) => {
        const active = option.value === value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            title={option.label}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-8 items-center justify-center rounded-sm px-2.5 transition-colors",
              active
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
          </button>
        );
      })}
    </div>
  );
}
