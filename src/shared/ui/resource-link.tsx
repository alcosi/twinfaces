import React, { ReactNode } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";

type Props<T> = {
  icon: ReactNode;
  data: T;
  renderTooltip: (data: T) => ReactNode;
  getDisplayName: (data: T) => string;
  getLink: (data: T) => string;
};

type ResourceLinkContentProps = {
  icon: ReactNode;
  link: string;
  displayName: string;
};

const ResourceLinkContent = ({
  icon,
  link,
  displayName,
}: ResourceLinkContentProps) => {
  return (
    <TooltipTrigger asChild>
      <Link
        href={link}
        className="max-w-full"
        passHref
        onClick={(e) => e.stopPropagation()}
      >
        <span className="inline-flex items-center h-6 max-w-full bg-white border border-gray-300 rounded-lg p-2 cursor-pointer transition-colors hover:border-[#0052CC]">
          {icon}
          <span className="ml-2 text-[#0052CC] text-sm font-medium truncate">
            {displayName}
          </span>
        </span>
      </Link>
    </TooltipTrigger>
  );
};

export const ResourceLink = <T,>({
  icon,
  data,
  renderTooltip,
  getDisplayName,
  getLink,
}: Props<T>) => {
  const displayName = getDisplayName(data);
  const link = getLink(data);
  const tooltipContent = renderTooltip(data);

  return (
    <Tooltip>
      <ResourceLinkContent icon={icon} link={link} displayName={displayName} />
      {tooltipContent && <TooltipContent side="left">{renderTooltip(data)}</TooltipContent>}
    </Tooltip>
  );
};
