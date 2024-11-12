import { Button } from "@/components/base/button";
import { isElementType, stopPropagation } from "@/shared/libs";
import { Copy, Link } from "lucide-react";
import React, {
  createElement,
  ElementType,
  isValidElement,
  PropsWithChildren,
  ReactNode,
} from "react";
import { toast } from "sonner";

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
      className="text-xs w-72 py-2 px-4 space-y-1.5"
      onClick={stopPropagation}
      style={{
        background:
          "linear-gradient(to bottom, #3b82f6 56px, transparent 56px)",
      }}
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
        <div className="text-sm whitespace-nowrap">{subTitle}</div>
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
    <div className="flex flex-row gap-2 items-center">
      {title && <strong>{title}:</strong>}
      {children}
    </div>
  );
};
