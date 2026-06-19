"use client";

import { EllipsisVertical, FolderUp } from "lucide-react";
import { useContext, useRef } from "react";

import { FactoryMultiplierContext } from "@/features/factory-multiplier";
import { FactoryMultiplierScreen } from "@/screens/factory-multiplier";
import { usePermissionsAccess } from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import {
  FactoryMultiplierExportSqlDialog,
  FactoryMultiplierExportSqlDialogRef,
} from "@/widgets/tables";

export default function Page() {
  const { factoryMultiplier } = useContext(FactoryMultiplierContext);
  const exportSqlDialogRef = useRef<FactoryMultiplierExportSqlDialogRef>(null);
  const { canForCurrentRoute } = usePermissionsAccess();
  const canCreate = canForCurrentRoute("CREATE");

  return (
    <>
      <FactoryMultiplierScreen
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
                    exportSqlDialogRef.current?.open(factoryMultiplier)
                  }
                  className="cursor-pointer"
                >
                  <FolderUp className="mr-2 h-5 w-5" />
                  Export sql
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null
        }
      />

      <FactoryMultiplierExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
