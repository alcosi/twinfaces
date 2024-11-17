import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { cn } from "@/shared/libs";
import Link from "next/link";
import { ElementType, ReactNode } from "react";

type ResourceLinkContentProps = {
  IconComponent: ElementType;
  displayName: string;
  disabled?: boolean;
};

type ResourceLinkProps<T> = {
  data: T;
  renderTooltip?: (data: T) => ReactNode;
  getDisplayName: (data: T) => string;
  link: string;
} & Pick<ResourceLinkContentProps, "IconComponent" | "disabled">;

const ResourceLinkContent = ({
  IconComponent,
  displayName,
  disabled,
}: ResourceLinkContentProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center h-6 max-w-full border rounded-lg px-2 transition-colors} bg-transparent",
        "border-link-light-disabled hover:border-link-light-active",
        "dark:border-link-dark-disabled dark:hover:border-link-dark-active",
        disabled
          ? "cursor-not-allowed hover:border-linklight-disabled dark:hover:border-link-dark-disabled"
          : "cursor-pointer"
      )}
    >
      <span
        className={cn(
          "h-4 w-4 flex items-center",
          disabled
            ? "text-link-light-disabled dark:text-link-dark-disabled"
            : "text-link-light-active dark:text-link-dark-active"
        )}
      >
        <IconComponent />
      </span>

      <span
        className={cn(
          "ml-2 text-sm font-medium truncate",
          disabled
            ? "text-link-light-disabled dark:text-link-dark-disabled"
            : "text-link-light-active dark:text-link-dark-active"
        )}
      >
        {displayName}
      </span>
    </span>
  );
};

export const ResourceLink = <T,>({
  IconComponent,
  data,
  renderTooltip,
  getDisplayName,
  link,
  disabled,
}: ResourceLinkProps<T>) => {
  const displayName = getDisplayName(data);

  const ResourceLinkWrapper = disabled ? (
    <ResourceLinkContent
      IconComponent={IconComponent}
      displayName={displayName}
      disabled={disabled}
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
        disabled={disabled}
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
