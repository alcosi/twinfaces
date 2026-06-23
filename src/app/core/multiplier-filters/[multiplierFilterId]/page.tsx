"use client";

import { Copy, EllipsisVertical } from "lucide-react";
import { useContext, useRef } from "react";

import { FactoryMultiplierFilterContext } from "@/features/factory-multiplier-filter";
import { FactoryMultiplierFilterScreen } from "@/screens/factory-multiplier-filter";
import { usePermissionsAccess } from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import {
  FactoryMultiplierFilterDuplicateDialog,
  FactoryMultiplierFilterDuplicateDialogRef,
} from "@/widgets/tables";

export default function Page() {
  const { factoryMultiplierFilter } = useContext(
    FactoryMultiplierFilterContext
  );
  const duplicateDialogRef =
    useRef<FactoryMultiplierFilterDuplicateDialogRef>(null);
  const { canForCurrentRoute } = usePermissionsAccess();
  const canCreate = canForCurrentRoute("CREATE");

  return (
    <>
      <FactoryMultiplierFilterScreen
        rightSlot={
          canCreate ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-foreground pr-0 hover:bg-transparent"
                >
                  <EllipsisVertical className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    duplicateDialogRef.current?.open(factoryMultiplierFilter)
                  }
                  className="cursor-pointer"
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Duplicate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null
        }
      />

      <FactoryMultiplierFilterDuplicateDialog ref={duplicateDialogRef} />
    </>
  );
}
