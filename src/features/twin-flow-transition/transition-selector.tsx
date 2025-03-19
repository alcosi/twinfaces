import { Ellipsis } from "lucide-react";
import { MouseEvent } from "react";

import { Twin_DETAILED } from "@/entities/twin";
import { TwinFlowTransition } from "@/entities/twin-flow-transition";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";

export const TransitionSelector = ({
  twin,
  onSelect,
}: {
  twin: Twin_DETAILED;
  onSelect: (
    transition: TwinFlowTransition,
    twin: Twin_DETAILED,
    event: MouseEvent
  ) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="iconS6" variant="outline">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {twin.transitions?.map((transition) => (
          <DropdownMenuItem
            key={transition.id}
            onClick={(event) => onSelect(transition, twin, event)}
            // onClick={(event) => {
            //   event.stopPropagation();
            //   return console.log(transition);
            // }}
          >
            {transition.name || "N/A"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
