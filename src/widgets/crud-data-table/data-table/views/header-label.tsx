import { ReactNode, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/shared/libs";

/**
 * Header cell content that centers itself once it wraps onto several lines.
 * Single-line headers stay left-aligned like the rest of the table.
 */
export function HeaderLabel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMultiline, setIsMultiline] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
      setIsMultiline(el.getBoundingClientRect().height > lineHeight * 1.5);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-centered={isMultiline || undefined}
      className={cn(
        "group/header-label",
        isMultiline ? "text-center" : "text-left"
      )}
    >
      {children}
    </div>
  );
}
