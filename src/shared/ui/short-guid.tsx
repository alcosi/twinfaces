import { CopyButton } from "@/shared/ui/copy-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

export interface ShortGuidProps {
  value: string | undefined;
  disableTooltip?: boolean;
}

export function ShortGuid({ value, disableTooltip }: ShortGuidProps) {
  if (!value) return null;

  const trigger = (
    <span>
      {value.substring(0, 8)}...{value.slice(-2)}
    </span>
  );

  return disableTooltip ? (
    trigger
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent>
        <span>{value}</span>
      </TooltipContent>
    </Tooltip>
  );
}

export function ShortGuidWithCopy({
  value,
  disableTooltip = false,
}: ShortGuidProps) {
  if (!value) {
    return <></>;
  }
  return (
    <div className="flex flex-row items-center gap-2">
      <ShortGuid value={value} disableTooltip={disableTooltip} />
      <CopyButton textToCopy={value} disableTooltip={disableTooltip} />
    </div>
  );
}
