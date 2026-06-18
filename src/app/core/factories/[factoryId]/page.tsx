"use client";

import { EllipsisVertical, FolderUp } from "lucide-react";
import { useContext, useRef } from "react";

import { FactoryContext } from "@/features/factory";
import {
  FactoryExportSqlDialog,
  FactoryExportSqlDialogRef,
} from "@/screens/factories";
import { FactoryScreen } from "@/screens/factory";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";

export default function Page() {
  const { factory } = useContext(FactoryContext);
  const exportSqlDialogRef = useRef<FactoryExportSqlDialogRef>(null);

  return (
    <>
      <FactoryScreen
        rightSlot={
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
                onClick={() => exportSqlDialogRef.current?.open(factory)}
                className="cursor-pointer"
              >
                <FolderUp className="mr-2 h-5 w-5" />
                Export sql
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <FactoryExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
