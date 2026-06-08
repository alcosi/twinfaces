"use client";

import { Copy, EllipsisVertical, FolderUp } from "lucide-react";
import { useContext, useRef } from "react";

import { TwinClassContext } from "@/entities/twin-class";
import {
  TwinClassRelations,
  TwinClassRelationsGraph,
} from "@/screens/twin-class-relations";
import {
  TwinClassDuplicateDialog,
  TwinClassDuplicateDialogRef,
  TwinClassExportSqlDialog,
  TwinClassExportSqlDialogRef,
} from "@/screens/twin-classes";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { Tab, TabsLayout } from "@/widgets/layout";
import {
  SpaceRolesTable,
  TwinClassDynamicMarkersTable,
  TwinClassFieldsTable,
  TwinClassStatusesTable,
  TwinFlows,
} from "@/widgets/tables";

import { TwinClassGeneral } from "./views";

export default function TwinClassPage() {
  const { twinClassId, twinClass } = useContext(TwinClassContext);
  const duplicateDialogRef = useRef<TwinClassDuplicateDialogRef>(null);
  const exportSqlDialogRef = useRef<TwinClassExportSqlDialogRef>(null);

  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <TwinClassGeneral />,
    },
    {
      key: "fields",
      label: "Fields",
      content: <TwinClassFieldsTable twinClassId={twinClassId} />,
    },
    {
      key: "statuses",
      label: "Statuses",
      content: <TwinClassStatusesTable twinClassId={twinClassId} />,
    },
    {
      key: "twinflows",
      label: "Twinflows",
      content: <TwinFlows twinClassId={twinClassId} />,
    },
    {
      key: "relations",
      label: "Relations",
      content: <TwinClassRelations />,
    },
    {
      key: "graph",
      label: "Graph",
      content: <TwinClassRelationsGraph />,
    },
    {
      key: "dynamicMarkers",
      label: "Dynamic markers",
      content: <TwinClassDynamicMarkersTable twinClassId={twinClassId} />,
    },
    {
      key: "spaceRoles",
      label: "Space roles",
      content: <SpaceRolesTable />,
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
                className="text-primary hover:text-foreground pr-0 hover:bg-transparent"
              >
                <EllipsisVertical className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => duplicateDialogRef.current?.open(twinClass)}
                className="cursor-pointer"
              >
                <Copy className="mr-2 h-5 w-5" />
                Duplicate
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => exportSqlDialogRef.current?.open(twinClass)}
                className="cursor-pointer"
              >
                <FolderUp className="mr-2 h-5 w-5" />
                Export sql
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <TwinClassDuplicateDialog ref={duplicateDialogRef} />
      <TwinClassExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
