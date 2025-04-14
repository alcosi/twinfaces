import { Ellipsis } from "lucide-react";
import { ReactNode } from "react";

import { usePerformTransition } from "@/entities/twin-flow-transition";
import { Twin_DETAILED } from "@/entities/twin/server";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";

type Props = {
  twin: Twin_DETAILED;
  onSuccess?: () => void;
};

export const TransitionPerformer = ({ twin, onSuccess }: Props) => {
  const { performTransition } = usePerformTransition();

  async function handleTransition(transitionId: string) {
    try {
      await performTransition({
        transitionId,
        body: { twinId: twin.id },
      });

      onSuccess?.();
    } catch (error) {
      console.error("Failed to perform transition:", error);
      throw error;
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="iconS6" variant="outline">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {twin.transitions?.reduce<ReactNode[]>((acc, { id, name, type }) => {
          if (type === "STATUS_CHANGE") {
            acc.push(
              <DropdownMenuItem
                key={id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTransition(id!);
                }}
              >
                {name || "N/A"}
              </DropdownMenuItem>
            );
          }

          return acc;
        }, [])}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
