import { cn } from "@/shared/libs";

/**
 * Read-only boolean for table cells: a hollow ring when off, a filled dot with
 * a soft halo when on. Unlike a bare check mark, "off" is visible too.
 * Centered horizontally within its table cell; in an entity card field it
 * sits at the start, in line with the other values.
 */
export function BooleanIndicator({
  value,
  className,
}: {
  value?: boolean | null;
  className?: string;
}) {
  const checked = value === true;

  return (
    <span className="flex w-full justify-center in-data-[slot=entity-card-field-value]:justify-start">
      <span
        role="img"
        aria-label={checked ? "Yes" : "No"}
        className={cn(
          "inline-flex h-4 w-4 shrink-0 rounded-full border transition-colors",
          checked
            ? "border-link-enabled bg-link-enabled ring-link-enabled/20 ring-4"
            : "border-muted-foreground/40 bg-background",
          className
        )}
      />
    </span>
  );
}
