"use client";

import { EllipsisVertical, FolderUp } from "lucide-react";
import { useContext, useRef } from "react";

import { FactoryBranchContext } from "@/features/factory-branch";
import { FactoryBranchScreen } from "@/screens/factory-branch";
import { usePermissionsAccess } from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import {
  FactoryBranchExportSqlDialog,
  FactoryBranchExportSqlDialogRef,
} from "@/widgets/tables";

export default function Page() {
  const { factoryBranch } = useContext(FactoryBranchContext);
  const exportSqlDialogRef = useRef<FactoryBranchExportSqlDialogRef>(null);
  const { canForCurrentRoute } = usePermissionsAccess();
  const canCreate = canForCurrentRoute("CREATE");

  return (
    <>
      <FactoryBranchScreen
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
                    exportSqlDialogRef.current?.open(factoryBranch)
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

      <FactoryBranchExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
