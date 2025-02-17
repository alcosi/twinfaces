import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { cn, isFalsy } from "@/shared/libs";
import { css } from "@emotion/css";
import Link from "next/link";
import { ElementType, ReactNode } from "react";

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
    base: "inline-flex items-center h-6 max-w-full border rounded-lg px-2 transition-colors",
    borderColor: disabled
      ? "border-link-light-disabled dark:border-link-dark-disabled"
      : "",
    hover: disabled
      ? "hover:border-link-light-disabled dark:hover:border-link-dark-disabled"
      : "hover:border-link-light-active dark:hover:border-link-dark-active",
    text: disabled
      ? "text-link-light-disabled dark:text-link-dark-disabled"
      : "text-link-light-active dark:text-link-dark-active",
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
            "h-4 w-4 flex items-center",
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
          `${hideIcon ? "text-sm font-medium truncate" : "ml-2 text-sm font-medium truncate"}`,
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
