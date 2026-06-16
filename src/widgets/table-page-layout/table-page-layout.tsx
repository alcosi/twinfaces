import { ChevronDown } from "lucide-react";
import { type ComponentType, type ReactNode } from "react";

import { cn } from "@/shared/libs";

type TablePageVariant = "surface" | "fill" | "flow";

/** Accepts both lucide icons and the project's custom SVG entity icons. */
type IconComponent = ComponentType<{ className?: string }>;

interface TablePageLayoutProps {
  title: string;
  description?: string;
  icon?: IconComponent;
  children: ReactNode;
  /**
   * - `surface` (default): table fills the viewport inside a soft rounded card.
   * - `fill`: table fills the viewport, no card — for screens with their own
   *   chrome (e.g. tab bars).
   * - `flow`: natural document flow + page scroll, no card — for screens that
   *   stack several tables.
   */
  variant?: TablePageVariant;
  className?: string;
  /**
   * Render the header expanded (full banner) on first paint. Defaults to
   * collapsed — a slim title bar that the user can expand on demand to free up
   * vertical space for the table.
   */
  defaultExpanded?: boolean;
}

/**
 * Branded page shell for list/table screens — a brand-tinted header (icon chip
 * + title + description) above the table. Mirrors the /profile visual language.
 * Server-compatible (no client hooks): the header is a collapsible, JS-free
 * native `<details>`/`<summary>`, collapsed by default to a slim title bar and
 * expanding to the full banner on click.
 *
 * Wrap a list page's content with this at the *page* level — never inside the
 * shared table widgets, which may be embedded as tabs on detail pages.
 */
export function TablePageLayout({
  title,
  description,
  icon: Icon,
  children,
  variant = "surface",
  className,
  defaultExpanded = false,
}: TablePageLayoutProps) {
  const fills = variant !== "flow";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 py-4",
        fills && "min-h-0 flex-1",
        className
      )}
    >
      <details
        open={defaultExpanded}
        className="group from-brand-500/10 via-brand-500/5 to-card border-brand-500/10 shrink-0 overflow-hidden rounded-2xl border bg-gradient-to-br"
      >
        <summary className="flex cursor-pointer list-none items-center gap-2.5 px-3 py-2 transition-all group-open:gap-4 group-open:p-5 [&::-webkit-details-marker]:hidden">
          {Icon && (
            <div className="bg-brand-500/10 text-brand-500 ring-brand-500/20 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-sm ring-2 transition-all group-open:h-14 group-open:w-14 group-open:rounded-2xl group-open:ring-4">
              <Icon className="h-4 w-4 transition-all group-open:h-7 group-open:w-7" />
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-1">
            <h1 className="truncate text-sm font-semibold tracking-tight transition-all group-open:text-2xl">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground hidden text-sm group-open:block">
                {description}
              </p>
            )}
          </div>
          <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
        </summary>
      </details>

      {variant === "surface" ? (
        <section className="bg-card border-border flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border px-4 shadow-xs sm:px-5">
          {children}
        </section>
      ) : variant === "fill" ? (
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}
