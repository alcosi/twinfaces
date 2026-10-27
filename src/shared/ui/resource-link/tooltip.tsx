"use client";

import { Copy, Link } from "lucide-react";
import React, {
  ElementType,
  PropsWithChildren,
  ReactNode,
  createContext,
  createElement,
  isValidElement,
  useContext,
} from "react";
import { toast } from "sonner";

import { isElementType, stopPropagation } from "@/shared/libs";
import { Button } from "@/shared/ui/button";

export const RESOURCE_LINK_TOOLTIP_DELAY_MS = 500;

export type ResourceLinkTooltipProps = PropsWithChildren<{
  uuid: string;
  link?: string;
  actions?: ReactNode;
}>;

/**
 * The entity's own actions — the duplicate/export menu. Handed to the root but
 * drawn in the header's corner, the way the graph cards carry their menu, so
 * it travels to the header through context rather than through every tooltip.
 */
const ActionsContext = createContext<ReactNode>(null);

export function ResourceLinkTooltip({
  uuid,
  link,
  actions,
  children,
}: ResourceLinkTooltipProps) {
  function handleCopyUUID(e: React.MouseEvent) {
    stopPropagation(e);
    navigator.clipboard.writeText(uuid).then(() => {
      toast.message("UUID is copied");
    });
  }

  function handleCopyLink(e: React.MouseEvent) {
    stopPropagation(e);
    const baseUrl = window?.location.origin ?? "";
    // Ensure there are no double slashes in the constructed URL
    const text = `${baseUrl}/${link}`.replace(/([^:]\/)\/+/g, "$1");
    navigator.clipboard.writeText(text).then(() => {
      toast.message("Link is copied");
    });
  }

  // Drawn as a card: header, blocks under dividers, actions at the bottom —
  // the same shape as the cards of the class and factory graphs.
  return (
    <div className="w-72 text-xs" onClick={(e) => e.stopPropagation()}>
      <ActionsContext.Provider value={actions}>
        {children}
      </ActionsContext.Provider>

      <footer className="border-border flex gap-2 border-t p-3">
        <Button
          variant="outline"
          size="xs"
          className="hover:bg-secondary flex min-w-0 flex-1 flex-row items-center gap-1 p-0.5"
          onClick={handleCopyUUID}
        >
          <Copy className="h-3.5 w-3.5" />
          Copy UUID
        </Button>
        <Button
          variant="outline"
          size="xs"
          className="hover:bg-secondary flex min-w-0 flex-1 flex-row items-center gap-1 p-0.5"
          onClick={handleCopyLink}
          disabled={!link}
        >
          <Link className="h-3.5 w-3.5" />
          Copy Link
        </Button>
      </footer>
    </div>
  );
}

type HeaderProps = {
  title: string;
  subTitle?: string;
  iconSource?: ReactNode | ElementType;
};

ResourceLinkTooltip.Header = function Header({
  title,
  subTitle,
  iconSource,
}: HeaderProps) {
  const actions = useContext(ActionsContext);

  const renderIcon = () => {
    if (isValidElement(iconSource)) {
      return iconSource;
    }

    if (isElementType(iconSource)) {
      return createElement(iconSource, {
        className: "h-[18px] w-[18px]",
      });
    }

    return null;
  };

  return (
    <header className="flex items-start gap-2.5 p-3">
      {/* Icons arrive sized for the old 64px circle. The tile brings an icon
          down to its own size, and lets an avatar fill it edge to edge. */}
      <div className="bg-brand-500/10 text-brand-600 dark:text-brand-400 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md [&>*:not(svg)]:size-full [&>*:not(svg)]:rounded-md [&>*:not(svg)]:border-0 [&>svg]:size-[18px]">
        {renderIcon()}
      </div>

      <div className="flex min-h-9 min-w-0 flex-1 flex-col justify-center">
        <div className="text-foreground truncate text-sm leading-5 font-semibold">
          {title}
        </div>
        {subTitle && (
          <div className="text-muted-foreground truncate text-xs leading-4">
            {subTitle}
          </div>
        )}
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
};

type MainProps = PropsWithChildren<{}>;

ResourceLinkTooltip.Main = function Main({ children }: MainProps) {
  // `empty:hidden`: every item of a block is usually conditional, and a block
  // with nothing in it would otherwise still draw its divider.
  return (
    <main className="border-border text-foreground space-y-2 border-t p-3 text-xs empty:hidden">
      {children}
    </main>
  );
};

type ItemProps = PropsWithChildren<{
  title?: string;
}>;

ResourceLinkTooltip.Item = function Item({ title, children }: ItemProps) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      {title && <span className="text-muted-foreground shrink-0">{title}</span>}
      <div className="flex min-w-0 flex-wrap items-center gap-1">
        {children}
      </div>
    </div>
  );
};
