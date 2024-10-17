import { TwinClassStatus } from "@/lib/api/api-types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";

export interface TwinflowStatusViewProps {
  status?: TwinClassStatus;
}

export function ClassStatusView({ status }: TwinflowStatusViewProps) {
  if (!status) return null;

  return (
    <div className="flex flex-row gap-2 items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: status.color }}
          />
        </TooltipTrigger>
        <TooltipContent>{status.color}</TooltipContent>
      </Tooltip>
      {status.name ?? status.key}
    </div>
  );
}
