import { css } from "@emotion/css";
import Link from "next/link";
import { ElementType, ReactNode } from "react";

import { cn, isFalsy } from "@/shared/libs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

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

const ResourceLinkContent = ({
  IconComponent,
  displayName,
  disabled,
  backgroundColor = "transparent",
  fontColor,
  hideIcon,
}: ResourceLinkContentProps) => {
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
};

export const ResourceLink = <T,>({
  IconComponent,
  data,
  renderTooltip,
  getDisplayName,
  link,
  disabled,
  backgroundColor,
  fontColor,
  hideIcon,
}: ResourceLinkProps<T>) => {
  const displayName = getDisplayName(data);

  const ResourceLinkWrapper = disabled ? (
    <ResourceLinkContent
      IconComponent={IconComponent}
      displayName={displayName}
      disabled={disabled}
      backgroundColor={backgroundColor}
      fontColor={fontColor}
      hideIcon={hideIcon}
    />
  ) : (
    <Link
      href={link}
      className="max-w-full"
      passHref
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
    <Tooltip>
      <TooltipTrigger asChild>{ResourceLinkWrapper}</TooltipTrigger>
      <TooltipContent className="p-0">{renderTooltip(data)}</TooltipContent>
    </Tooltip>
  ) : (
    ResourceLinkWrapper
  );
};
