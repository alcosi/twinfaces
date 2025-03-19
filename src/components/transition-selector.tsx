import { EllipsisVertical } from "lucide-react";

import { TwinFlowTransition } from "@/entities/twin-flow-transition";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";

type TransitionSelectorProps = {
  transitions: TwinFlowTransition[];
  onSelect: (transition: TwinFlowTransition) => void;
};

export const TransitionSelector = ({
  transitions,
  onSelect,
}: TransitionSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="iconSm" variant="outline">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {transitions.map((transition) => (
          <DropdownMenuItem
            key={transition.id}
            onClick={() => onSelect(transition)}
          >
            {transition.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
