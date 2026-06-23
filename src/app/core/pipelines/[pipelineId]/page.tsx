"use client";

import { Copy, EllipsisVertical } from "lucide-react";
import { useContext, useRef } from "react";

import { FactoryPipelineContext } from "@/features/factory-pipeline";
import { FactoryPipelineScreen } from "@/screens/factory-pipeline";
import { usePermissionsAccess } from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import {
  FactoryPipelineDuplicateDialog,
  FactoryPipelineDuplicateDialogRef,
} from "@/widgets/tables";

export default function Page() {
  const { pipeline } = useContext(FactoryPipelineContext);
  const duplicateDialogRef = useRef<FactoryPipelineDuplicateDialogRef>(null);
  const { canForCurrentRoute } = usePermissionsAccess();
  const canCreate = canForCurrentRoute("CREATE");

  return (
    <>
      <FactoryPipelineScreen
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
                  onClick={() => duplicateDialogRef.current?.open(pipeline)}
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

      <FactoryPipelineDuplicateDialog ref={duplicateDialogRef} />
    </>
  );
}
