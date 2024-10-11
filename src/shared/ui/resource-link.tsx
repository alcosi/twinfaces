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
} & Pick<ResourceLinkContentProps, 'icon' | 'disabled'>;

const ResourceLinkContent = ({
  icon,
  link,
  displayName,
  disabled,
}: ResourceLinkContentProps) => {
  const content = (
    <span
      className={cn(
        "inline-flex items-center h-6 max-w-full bg-white border border-gray-300 rounded-lg p-2 transition-colors hover:border-[#0052CC]}",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      {icon}
      <span className="ml-2 text-[#0052CC] text-sm font-medium truncate">
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
