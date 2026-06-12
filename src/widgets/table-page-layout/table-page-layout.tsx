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
}

/**
 * Branded page shell for list/table screens — a brand-tinted header (icon chip
 * + title + description) above the table. Mirrors the /profile visual language.
 * Server-compatible (no client hooks).
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
      <header className="from-brand-500/10 via-brand-500/5 to-card border-brand-500/10 shrink-0 overflow-hidden rounded-2xl border bg-gradient-to-br">
        <div className="flex items-center gap-4 p-5">
          {Icon && (
            <div className="bg-brand-500/10 text-brand-500 ring-brand-500/20 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-4">
              <Icon className="h-7 w-7" />
            </div>
          )}
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>
        </div>
      </header>

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
