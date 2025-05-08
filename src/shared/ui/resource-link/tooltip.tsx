import { css } from "@emotion/css";
import { Copy, Link } from "lucide-react";
import React, {
  ElementType,
  PropsWithChildren,
  ReactNode,
  createElement,
  isValidElement,
} from "react";
import { toast } from "sonner";

import { cn, isElementType, stopPropagation } from "@/shared/libs";
import { Button } from "@/shared/ui/button";

export type ResourceLinkTooltipProps = PropsWithChildren<{
  uuid: string;
  link?: string;
}>;

const brandGradient = css`
  background: linear-gradient(
    to bottom,
    var(--brand-500) 0px,
    var(--brand-500) 56px,
    transparent 56px
  );
`;

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
      className={cn("w-72 space-y-1.5 px-4 py-2 text-xs", brandGradient)}
      onClick={(e) => e.stopPropagation()}
    >
      {children}

      <footer className="flex justify-between gap-x-2">
        <Button
          variant="outline"
          size="xs"
          className="hover:bg-secondary flex w-full flex-row items-center gap-1 p-0.5"
          onClick={handleCopyUUID}
        >
          <Copy className="h-3.5 w-3.5" />
          Copy UUID
        </Button>
        <Button
          variant="outline"
          size="xs"
          className="hover:bg-secondary flex w-full flex-row items-center gap-1 p-0.5"
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
    <header className="text-primary-foreground flex h-16 gap-x-4 text-base">
      <div className="bg-muted text-link-enabled flex h-16 w-16 shrink-0 items-center justify-center rounded-full">
        {renderIcon()}
      </div>

      <div className="flex h-12 flex-col justify-end overflow-hidden">
        <div className="truncate font-semibold whitespace-nowrap">{title}</div>
        <div className="truncate text-sm whitespace-nowrap">{subTitle}</div>
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
    <div className="flex max-w-48 flex-row items-center gap-2">
      {title && <strong>{title}:</strong>}
      {children}
    </div>
  );
};
