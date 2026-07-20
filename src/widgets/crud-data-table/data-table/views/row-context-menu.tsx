"use client";

import { ExternalLink } from "lucide-react";
import { ReactElement } from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shared/ui";

/**
 * Wraps a table row (grid `<tr>` or list card) in a right-click context menu
 * offering "Open in new tab". When `href` is undefined the child is returned
 * as-is, so rows without a resolvable URL are unaffected.
 */
export function RowContextMenu({
  href,
  children,
}: {
  href?: string;
  children: ReactElement;
}) {
  if (!href) return children;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          className="cursor-pointer rounded-md"
          onSelect={() => window.open(href, "_blank", "noopener,noreferrer")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open in new tab
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
