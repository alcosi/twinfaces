"use client";

import { Copy, EllipsisVertical } from "lucide-react";
import { useContext, useRef } from "react";

import { FactoryConditionSetContext } from "@/features/factory-condition-set";
import { FactoryConditionSetScreen } from "@/screens/condition-sets";
import {
  FactoryConditionSetDuplicateDialog,
  FactoryConditionSetDuplicateDialogRef,
} from "@/screens/condition-sets";
import { usePermissionsAccess } from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";

export default function Page() {
  const { factoryConditionSet } = useContext(FactoryConditionSetContext);
  const duplicateDialogRef =
    useRef<FactoryConditionSetDuplicateDialogRef>(null);
  const { canForCurrentRoute } = usePermissionsAccess();
  const canCreate = canForCurrentRoute("CREATE");

  return (
    <>
      <FactoryConditionSetScreen
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
                    duplicateDialogRef.current?.open(factoryConditionSet)
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

      <FactoryConditionSetDuplicateDialog ref={duplicateDialogRef} />
    </>
  );
}
