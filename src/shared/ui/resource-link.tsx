import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ElementType, ReactNode } from "react";

type ResourceLinkContentProps = {
  IconComponent: ElementType;
  link: string;
  displayName: string;
  disabled?: boolean;
};

type ResourceLinkProps<T> = {
  data: T;
  renderTooltip?: (data: T) => ReactNode;
  getDisplayName: (data: T) => string;
  getLink: (data: T) => string;
} & Pick<ResourceLinkContentProps, "IconComponent" | "disabled">;

const ResourceLinkContent = ({
  IconComponent,
  link,
  displayName,
  disabled,
}: ResourceLinkContentProps) => {
  const content = (
    <span
      className={cn(
        "inline-flex items-center h-6 max-w-full border rounded-lg p-2 transition-colors} bg-transparent",
        "border-link-light-disabled hover:border-link-light-active",
        "dark:border-link-dark-disabled dark:hover:border-link-dark-active",
        disabled
          ? "cursor-not-allowed hover:border-linklight-disabled dark:hover:border-link-dark-disabled"
          : "cursor-pointer"
      )}
    >
      <span
        className={
          disabled
            ? "text-link-light-disabled dark:text-link-dark-disabled"
            : "text-link-light-active dark:text-link-dark-active"
        }
      >
        <IconComponent className="h-4 w-4" />
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
  return (
    <TooltipTrigger asChild>
      {disabled ? (
        content
      ) : (
        <Link
          href={link}
          className="max-w-full"
          passHref
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </Link>
      )}
    </TooltipTrigger>
  );
};

export const ResourceLink = <T,>({
  IconComponent,
  data,
  renderTooltip,
  getDisplayName,
  getLink,
  disabled,
}: ResourceLinkProps<T>) => {
  const displayName = getDisplayName(data);
  const link = getLink(data);

  return (
    <Tooltip>
      <ResourceLinkContent
        IconComponent={IconComponent}
        link={link}
        displayName={displayName}
        disabled={disabled}
      />
      {renderTooltip && (
        <TooltipContent className="p-0">{renderTooltip(data)}</TooltipContent>
      )}
    </Tooltip>
  );
};
