import { Ellipsis } from "lucide-react";

import { TwinFlowTransition } from "@/entities/twin-flow-transition";
import { Twin_DETAILED } from "@/entities/twin/server";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";

export const TransitionPerformer = ({
  twin,
  onSelect,
}: {
  twin: Twin_DETAILED;
  onSelect: ({
    transition,
    twin,
  }: {
    transition: TwinFlowTransition;
    twin: Twin_DETAILED;
  }) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="iconS6" variant="outline">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {twin.transitions
          ?.filter((transition) => transition.type === "STATUS_CHANGE")
          .map((transition) => (
            <DropdownMenuItem
              key={transition.id}
              onClick={(event) => {
                event.stopPropagation();
                onSelect({ transition, twin });
              }}
            >
              {transition.name || "N/A"}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
