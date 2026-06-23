"use client";

import { Copy, EllipsisVertical, FolderUp } from "lucide-react";
import { useContext, useRef } from "react";

import { PipelineStepContext } from "@/features/pipeline-step";
import { PipelineStepScreen } from "@/screens/pipeline-step";
import { usePermissionsAccess } from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import {
  FactoryPipelineStepDuplicateDialog,
  FactoryPipelineStepDuplicateDialogRef,
  FactoryPipelineStepExportSqlDialog,
  FactoryPipelineStepExportSqlDialogRef,
} from "@/widgets/tables";

export default function Page() {
  const { step } = useContext(PipelineStepContext);
  const duplicateDialogRef =
    useRef<FactoryPipelineStepDuplicateDialogRef>(null);
  const exportSqlDialogRef =
    useRef<FactoryPipelineStepExportSqlDialogRef>(null);
  const { canForCurrentRoute } = usePermissionsAccess();
  const canCreate = canForCurrentRoute("CREATE");

  return (
    <>
      <PipelineStepScreen
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
                  onClick={() => duplicateDialogRef.current?.open(step)}
                  className="cursor-pointer"
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => exportSqlDialogRef.current?.open(step)}
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

      <FactoryPipelineStepDuplicateDialog ref={duplicateDialogRef} />
      <FactoryPipelineStepExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
