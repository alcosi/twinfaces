import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { TwinClassStatus } from "@/entities/twinClassStatus";
import { ColorTile } from "@/shared/ui";

export interface TwinflowStatusViewProps {
  status?: TwinClassStatus;
}

export function ClassStatusView({ status }: TwinflowStatusViewProps) {
  if (!status) return null;

  return (
    <div className="flex flex-row gap-2 items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <ColorTile color={status.backgroundColor} />
        </TooltipTrigger>
        <TooltipContent>{status.backgroundColor}</TooltipContent>
      </Tooltip>
      {status.name ?? status.key}
    </div>
  );
}
