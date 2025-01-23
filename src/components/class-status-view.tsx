import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { TwinStatus } from "@/entities/twin-status";
import { ColorTile } from "@/shared/ui";

export interface TwinflowStatusViewProps {
  status?: TwinStatus;
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
