"use client";

import { Copy, EllipsisVertical } from "lucide-react";
import { useContext, useRef } from "react";

import { FactoryConditionContext } from "@/features/factory-condition";
import { FactoryConditionScreen } from "@/screens/factory-condition";
import { usePermissionsAccess } from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import {
  FactoryConditionDuplicateDialog,
  FactoryConditionDuplicateDialogRef,
} from "@/widgets/tables";

export default function Page() {
  const { factoryCondition } = useContext(FactoryConditionContext);
  const duplicateDialogRef = useRef<FactoryConditionDuplicateDialogRef>(null);
  const { canForCurrentRoute } = usePermissionsAccess();
  const canCreate = canForCurrentRoute("CREATE");

  return (
    <>
      <FactoryConditionScreen
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
                    duplicateDialogRef.current?.open(factoryCondition)
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

      <FactoryConditionDuplicateDialog ref={duplicateDialogRef} />
    </>
  );
}
