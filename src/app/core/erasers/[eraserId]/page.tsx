"use client";

import { Copy, EllipsisVertical, FolderUp } from "lucide-react";
import { useContext, useRef } from "react";

import { FactoryEraserContext } from "@/features/factory-eraser";
import { FactoryEraserScreen } from "@/screens/factory-eraser";
import {
  FactoryEraserDuplicateDialog,
  FactoryEraserDuplicateDialogRef,
  FactoryEraserExportSqlDialog,
  FactoryEraserExportSqlDialogRef,
} from "@/screens/factory-erasers";
import { usePermissionsAccess } from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";

export default function Page() {
  const { eraser } = useContext(FactoryEraserContext);
  const duplicateDialogRef = useRef<FactoryEraserDuplicateDialogRef>(null);
  const exportSqlDialogRef = useRef<FactoryEraserExportSqlDialogRef>(null);
  const { canForCurrentRoute } = usePermissionsAccess();
  const canCreate = canForCurrentRoute("CREATE");

  return (
    <>
      <FactoryEraserScreen
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
                  onClick={() => duplicateDialogRef.current?.open(eraser)}
                  className="cursor-pointer"
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => exportSqlDialogRef.current?.open(eraser)}
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

      <FactoryEraserDuplicateDialog ref={duplicateDialogRef} />
      <FactoryEraserExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
