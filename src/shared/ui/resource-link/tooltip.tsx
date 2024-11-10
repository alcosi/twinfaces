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
      className="text-sm w-96 p-6 space-y-4"
      onClick={stopPropagation}
      style={{
        background:
          "linear-gradient(to bottom, #3b82f6 96px, transparent 96px)",
      }}
    >
      {children}

      <footer className="flex gap-x-2 justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex flex-row gap-2 items-center hover:bg-secondary w-full p-0.5"
          onClick={handleCopyUUID}
        >
          <Copy className="h-4 w-4" />
          Copy UUID
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex flex-row gap-2 items-center hover:bg-secondary w-full p-0.5"
          onClick={handleCopyLink}
          disabled={!link}
        >
          <Link className="h-4 w-4" />
          Copy Link
        </Button>
      </footer>
    </div>
  );
}

type HeaderProps = PropsWithChildren<{
  iconSource?: ReactNode | ElementType;
}>;

ResourceLinkTooltip.Header = function Header({
  iconSource,
  children,
}: HeaderProps) {
  const renderIcon = () => {
    if (isValidElement(iconSource)) {
      return iconSource;
    }

    if (isElementType(iconSource)) {
      return createElement(iconSource, {
        className: "w-16 h-16",
      });
    }

    return null;
  };

  return (
    <header className="flex h-24 gap-x-4 text-primary-foreground">
      <div className="h-24 w-24 rounded-full bg-muted text-link-light-active dark:text-link-dark-active flex shrink-0 justify-center items-center">
        {renderIcon()}
      </div>

      <div className="flex flex-col justify-end h-16 overflow-hidden">
        {children}
      </div>
    </header>
  );
};

type MainProps = PropsWithChildren<{}>;

ResourceLinkTooltip.Main = function Main({ children }: MainProps) {
  return <main className="space-y-2 text-base">{children}</main>;
};
