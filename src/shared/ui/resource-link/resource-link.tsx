"use client";

import { css } from "@emotion/css";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import Link from "next/link";
import { ElementType, ReactNode, useCallback, useState } from "react";

import { cn, isFalsy, usePermissionsAccess } from "@/shared/libs";
import {
  TooltipContent,
  TooltipLockProvider,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

import { RESOURCE_LINK_TOOLTIP_DELAY_MS } from "./tooltip";

type ResourceLinkContentProps = {
  IconComponent: ElementType;
  displayName: string;
  disabled?: boolean;
  backgroundColor?: string;
  fontColor?: string;
  hideIcon?: boolean;
};

type ResourceLinkProps<T> = {
  data: T;
  renderTooltip?: (data: T) => ReactNode;
  getDisplayName: (data: T) => string;
  link: string;
} & Pick<
  ResourceLinkContentProps,
  "IconComponent" | "disabled" | "backgroundColor" | "fontColor" | "hideIcon"
>;

function ResourceLinkContent({
  IconComponent,
  displayName,
  disabled,
  backgroundColor = "transparent",
  fontColor,
  hideIcon,
}: ResourceLinkContentProps) {
  const styles = {
    base: "inline-flex items-center h-6 max-w-full border border-border rounded-lg px-2 transition-colors",
    borderColor: disabled ? "border-link-disabled" : "",
    hover: disabled
      ? "hover:border-link-disabled"
      : "hover:border-link-enabled",
    text: disabled ? "text-link-disabled" : "text-link-enabled",
  };

  return (
    <div
      className={cn(
        styles.base,
        styles.borderColor,
        styles.hover,
        styles.text,
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        css`
          background-color: ${backgroundColor};
          &:hover {
            border-color: ${fontColor};
          }
        `
      )}
    >
      {isFalsy(hideIcon) && (
        <i
          className={cn(
            "flex h-4 w-4 items-center",
            css`
              color: ${fontColor};
            `
          )}
        >
          <IconComponent className="h-4 w-4" />
        </i>
      )}

      <span
        className={cn(
          `${hideIcon ? "truncate text-sm font-medium" : "ml-2 truncate text-sm font-medium"}`,
          css`
            color: ${fontColor};
          `
        )}
      >
        {displayName}
      </span>
    </div>
  );
}

export function ResourceLink<T>({
  IconComponent,
  data,
  renderTooltip,
  getDisplayName,
  link,
  disabled,
  backgroundColor,
  fontColor,
  hideIcon,
}: ResourceLinkProps<T>) {
  const { canForRoute } = usePermissionsAccess();
  const displayName = getDisplayName(data);

  // The tooltip is controlled only so that a menu inside it can hold it open:
  // Radix dismisses a tooltip as soon as the pointer heads anywhere but back to
  // the trigger, which is exactly where that menu's items are.
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const handleLockChange = useCallback((locked: boolean) => {
    setIsLocked(locked);
    // Nothing closed the tooltip while the menu held the pointer events, so
    // there is no hover state left to fall back to once the menu is gone.
    if (!locked) setIsOpen(false);
  }, []);

  // Disable the link when the user lacks the *_MANAGE permission for the route
  // it points to. An explicit `disabled` prop still wins.
  const isDisabled = disabled || !canForRoute(link, "MANAGE");

  const ResourceLinkWrapper = isDisabled ? (
    <ResourceLinkContent
      IconComponent={IconComponent}
      displayName={displayName}
      disabled={isDisabled}
      backgroundColor={backgroundColor}
      fontColor={fontColor}
      hideIcon={hideIcon}
    />
  ) : (
    <Link
      href={link}
      className="flex max-w-full"
      passHref
      prefetch={false}
      onClick={(e) => e.stopPropagation()}
    >
      <ResourceLinkContent
        IconComponent={IconComponent}
        displayName={displayName}
        backgroundColor={backgroundColor}
        fontColor={fontColor}
        hideIcon={hideIcon}
      />
    </Link>
  );

  return renderTooltip ? (
    <TooltipProvider
      delayDuration={RESOURCE_LINK_TOOLTIP_DELAY_MS}
      skipDelayDuration={0}
    >
      <TooltipPrimitive.Root open={isOpen || isLocked} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <span className="inline-flex max-w-full">{ResourceLinkWrapper}</span>
        </TooltipTrigger>
        <TooltipContent className="overflow-visible p-0">
          <TooltipLockProvider onLockChange={handleLockChange}>
            {renderTooltip(data)}
          </TooltipLockProvider>
        </TooltipContent>
      </TooltipPrimitive.Root>
    </TooltipProvider>
  ) : (
    <span className="inline-flex max-w-full">{ResourceLinkWrapper}</span>
  );
}
