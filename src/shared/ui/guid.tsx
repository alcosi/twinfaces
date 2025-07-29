import { CopyButton } from "@/shared/ui/copy-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

import { cn, shortenUUID } from "../libs";

export interface GuidProps {
  value: string | undefined;
  disableTooltip?: boolean;
  variant?: "short" | "long";
}

function Guid({ value, disableTooltip, variant = "short" }: GuidProps) {
  if (!value) return null;

  const displayValue = variant === "short" ? shortenUUID(value) : value;

  return disableTooltip ? (
    <span>{displayValue}</span>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>{displayValue}</span>
      </TooltipTrigger>
      <TooltipContent>
        <span>{value}</span>
      </TooltipContent>
    </Tooltip>
  );
}

export function GuidWithCopy({
  value,
  disableTooltip = false,
  variant,
}: GuidProps) {
  if (!value) return null;

  return (
    <div className="group flex items-center">
      <Guid value={value} disableTooltip={disableTooltip} variant={variant} />
      <CopyButton
        textToCopy={value}
        disableTooltip={disableTooltip}
        className={cn(
          "flex items-center",
          "-translate-x-1 transform opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
        )}
      />
    </div>
  );
}
