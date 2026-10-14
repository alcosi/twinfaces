"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/libs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

/**
 * Text that ellipsises, and reveals itself in a tooltip — but only when it is
 * actually clipped. Cards are fixed-width, so long names are routinely cut off
 * and unreadable; a tooltip on every one regardless would pop up over text that
 * is already whole.
 */
export function TruncatedText({
  text,
  className,
  lines = 1,
}: {
  text: string;
  className?: string;
  lines?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isClipped, setIsClipped] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Layout sizes, so the canvas zoom — a CSS transform — cannot skew them.
    const measure = () =>
      setIsClipped(
        element.scrollWidth > element.clientWidth + 1 ||
          element.scrollHeight > element.clientHeight + 1
      );

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [text]);

  return (
    // The trigger stays mounted whether or not the text is clipped: re-parenting
    // it would hand the effect a stale node and leave the observer detached.
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          ref={ref}
          className={cn(
            lines === 1 ? "truncate" : "overflow-hidden",
            className
          )}
          style={
            lines > 1
              ? {
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: lines,
                }
              : undefined
          }
        >
          {text}
        </div>
      </TooltipTrigger>
      {isClipped && (
        <TooltipContent className="max-w-xs break-words">{text}</TooltipContent>
      )}
    </Tooltip>
  );
}
