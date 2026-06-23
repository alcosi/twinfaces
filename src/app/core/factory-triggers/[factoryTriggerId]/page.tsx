"use client";

import { Copy, EllipsisVertical, FolderUp } from "lucide-react";
import { useContext, useRef } from "react";

import { FactoryTriggerContext } from "@/features/factory-trigger";
import { FactoryTriggerScreen } from "@/screens/factory-trigger";
import { usePermissionsAccess } from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import {
  FactoryTriggerDuplicateDialog,
  FactoryTriggerDuplicateDialogRef,
  FactoryTriggerExportSqlDialog,
  FactoryTriggerExportSqlDialogRef,
} from "@/widgets/tables";

export default function Page() {
  const { factoryTrigger } = useContext(FactoryTriggerContext);
  const duplicateDialogRef = useRef<FactoryTriggerDuplicateDialogRef>(null);
  const exportSqlDialogRef = useRef<FactoryTriggerExportSqlDialogRef>(null);
  const { canForCurrentRoute } = usePermissionsAccess();
  const canCreate = canForCurrentRoute("CREATE");

  return (
    <>
      <FactoryTriggerScreen
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
                    duplicateDialogRef.current?.open(factoryTrigger)
                  }
                  className="cursor-pointer"
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportSqlDialogRef.current?.open(factoryTrigger)
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

      <FactoryTriggerDuplicateDialog ref={duplicateDialogRef} />
      <FactoryTriggerExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
