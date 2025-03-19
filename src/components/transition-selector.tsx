import { Ellipsis } from "lucide-react";
import { MouseEvent, RefObject } from "react";
import { toast } from "sonner";

import { Twin_DETAILED } from "@/entities/twin";
import {
  TwinFlowTransition,
  useSelectTransition,
} from "@/entities/twin-flow-transition";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { DataTableHandle } from "@/widgets/crud-data-table";

export const TransitionSelector = ({
  twin,
  tableRef,
}: {
  twin: Twin_DETAILED;
  tableRef: RefObject<DataTableHandle>;
}) => {
  const { selectTransition } = useSelectTransition();

  const handleOnSelect = async (
    transition: TwinFlowTransition,
    event: MouseEvent
  ) => {
    event.stopPropagation();

    try {
      await selectTransition({
        transitionId: transition.id!,
        body: { twinId: twin.id },
      });

      tableRef.current?.resetPage();
      toast.success("Transition select successfully!");
    } catch (error) {
      toast.error("Error selecting transition!");
    }
  };

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
            onClick={(event) => handleOnSelect(transition, event)}
          >
            {transition.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
