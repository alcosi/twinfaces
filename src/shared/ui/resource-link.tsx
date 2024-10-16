import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

type ResourceLinkContentProps = {
  icon: ReactNode;
  link: string;
  displayName: string;
  disabled?: boolean;
};

type ResourceLinkProps<T> = {
  data: T;
  renderTooltip?: (data: T) => ReactNode;
  getDisplayName: (data: T) => string;
  getLink: (data: T) => string;
} & Pick<ResourceLinkContentProps, "icon" | "disabled">;

const ResourceLinkContent = ({
  icon,
  link,
  displayName,
  disabled,
}: ResourceLinkContentProps) => {
  const content = (
    <span
      className={cn(
        "inline-flex items-center h-6 max-w-full border rounded-lg p-2 transition-colors} bg-transparent",
        "border-[#091e4224] hover:border-[#0c66e4]",
        "dark:border-[#a6c5e229] dark:hover:border-[#579dff]",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      {icon}
      <span
        className={cn(
          "ml-2 text-sm font-medium truncate",
          "text-[#0c66e4]",
          "dark:text-[#579dff]"
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
  icon,
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
        icon={icon}
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
