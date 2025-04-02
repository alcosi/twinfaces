import { Copy, Link } from "lucide-react";
import React, {
  ElementType,
  PropsWithChildren,
  ReactNode,
  createElement,
  isValidElement,
} from "react";
import { toast } from "sonner";

import { isElementType, stopPropagation } from "@/shared/libs";
import { Button } from "@/shared/ui/button";

import { TOOLTIP_COLORS_BY_THEME } from "./constans";

export type ResourceLinkTooltipProps = PropsWithChildren<{
  uuid: string;
  link?: string;
}>;

export function ResourceLinkTooltip({
  uuid,
  link,
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

  return (
    <div
      className="text-xs w-72 py-2 px-4 space-y-1.5 dark:bg-[linear-gradient(to_bottom,var(--tooltip-dark)_56px,transparent_56px)] bg-[linear-gradient(to_bottom,var(--tooltip-light)_56px,transparent_56px)]"
      onClick={(e) => e.stopPropagation()}
      style={
        {
          "--tooltip-light": TOOLTIP_COLORS_BY_THEME.LIGHT,
          "--tooltip-dark": TOOLTIP_COLORS_BY_THEME.DARK,
        } as React.CSSProperties
      }
    >
      {children}

      <footer className="flex gap-x-2 justify-between">
        <Button
          variant="outline"
          size="xs"
          className="flex flex-row gap-1 items-center hover:bg-secondary w-full p-0.5"
          onClick={handleCopyUUID}
        >
          <Copy className="h-3.5 w-3.5" />
          Copy UUID
        </Button>
        <Button
          variant="outline"
          size="xs"
          className="flex flex-row gap-1 items-center hover:bg-secondary w-full p-0.5"
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
  const renderIcon = () => {
    if (isValidElement(iconSource)) {
      return iconSource;
    }

    if (isElementType(iconSource)) {
      return createElement(iconSource, {
        className: "w-8 h-8",
      });
    }

    return null;
  };

  return (
    <header className="flex text-base h-16 gap-x-4 text-primary-foreground">
      <div className="h-16 w-16  rounded-full bg-muted text-link-light-active dark:text-link-dark-active flex shrink-0 justify-center items-center">
        {renderIcon()}
      </div>

      <div className="flex flex-col justify-end h-12 overflow-hidden">
        <div className="font-semibold truncate whitespace-nowrap">{title}</div>
        <div className="text-sm truncate whitespace-nowrap">{subTitle}</div>
      </div>
    </header>
  );
};

type MainProps = PropsWithChildren<{}>;

ResourceLinkTooltip.Main = function Main({ children }: MainProps) {
  return <main className="space-y-1.5 py-1.5 text-xs">{children}</main>;
};

type ItemProps = PropsWithChildren<{
  title?: string;
}>;

ResourceLinkTooltip.Item = function Item({ title, children }: ItemProps) {
  return (
    <div className="flex max-w-48 flex-row gap-2 items-center">
      {title && <strong>{title}:</strong>}
      {children}
    </div>
  );
};
