"use client";

import { Copy, EllipsisVertical, FolderUp } from "lucide-react";
import { useRef } from "react";

import { TwinStatus_DETAILED } from "@/entities/twin-status";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { Tab, TabsLayout } from "@/widgets/layout";
import {
  TwinClassStatusExportSqlDialogRef,
  TwinClassStatusesDuplicateDialog,
  TwinClassStatusesDuplicateDialogRef,
  TwinClassStatusesExportSqlDialog,
} from "@/widgets/tables";

import {
  TwinStatusGeneral,
  TwinStatusTransitions,
  TwinStatusTriggers,
} from "./views";

export function StatusScreen({
  twinStatus,
}: {
  twinStatus: TwinStatus_DETAILED;
}) {
  const duplicateDialogRef = useRef<TwinClassStatusesDuplicateDialogRef>(null);
  const exportDialogRef = useRef<TwinClassStatusExportSqlDialogRef>(null);

  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <TwinStatusGeneral />,
    },
    {
      key: "triggers",
      label: "Triggers",
      content: <TwinStatusTriggers />,
    },
    {
      key: "transitions",
      label: "Transitions",
      content: <TwinStatusTransitions />,
    },
  ];

  return (
    <>
      <TabsLayout
        tabs={tabs}
        rightSlot={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-primary hover:text-foreground hover:bg-transparent"
              >
                <EllipsisVertical className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => duplicateDialogRef.current?.open(twinStatus)}
                className="cursor-pointer"
              >
                <Copy className="mr-2 h-5 w-5" />
                Duplicate
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => exportDialogRef.current?.open(twinStatus)}
                className="cursor-pointer"
              >
                <FolderUp className="mr-2 h-5 w-5" />
                Export sql
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <TwinClassStatusesDuplicateDialog ref={duplicateDialogRef} />
      <TwinClassStatusesExportSqlDialog ref={exportDialogRef} />
    </>
  );
}
