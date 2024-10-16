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

const COLORS = {
  light: {
    disabled: "[#091e4224]",
    active: "[#0c66e4]",
  },
  dark: {
    disabled: "[#a6c5e229]",
    active: "[#579dff]",
  },
};

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
        `border-${COLORS.light.disabled} hover:border-${COLORS.light.active}`,
        `dark:border-${COLORS.dark.disabled} dark:hover:border-${COLORS.dark.active}`,
        disabled
          ? `cursor-not-allowed hover:border-${COLORS.light.disabled} dark:hover:border-${COLORS.dark.disabled}`
          : "cursor-pointer"
      )}
    >
      <span
        className={
          disabled
            ? `text-${COLORS.light.disabled} dark:text-${COLORS.dark.disabled}`
            : `text-${COLORS.light.active} dark:text-${COLORS.dark.active}`
        }
      >
        <IconComponent className="h-4 w-4" />
      </span>

      <span
        className={cn(
          "ml-2 text-sm font-medium truncate",
          disabled
            ? `text-${COLORS.light.disabled} dark:text-${COLORS.dark.disabled}`
            : `text-${COLORS.light.active} dark:text-${COLORS.dark.active}`
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
        <TooltipContent side="left">{renderTooltip(data)}</TooltipContent>
      )}
    </Tooltip>
  );
};
