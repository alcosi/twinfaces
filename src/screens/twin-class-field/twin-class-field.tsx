"use client";

import { Copy, EllipsisVertical } from "lucide-react";
import { useRef } from "react";

import { TwinClassFieldV1_DETAILED } from "@/entities/twin-class-field";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { Tab, TabsLayout } from "@/widgets/layout";
import {
  TwinClassFieldDuplicateDialog,
  TwinClassFieldDuplicateDialogRef,
} from "@/widgets/tables/twin-class-fields/twin-class-field-duplicate-dialog";

import { TwinFieldGeneral } from "./views";
import { TwinFieldProjections } from "./views/twin-field-projections";

export function TwinClassFieldScreen({
  twinFieldId,
  twinField,
}: {
  twinFieldId: string;
  twinField: TwinClassFieldV1_DETAILED;
}) {
  const duplicateDialogRef = useRef<TwinClassFieldDuplicateDialogRef>(null);

  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: (
        <TwinFieldGeneral twinFieldId={twinFieldId} twinField={twinField} />
      ),
    },
    {
      key: "projections",
      label: "Projections",
      content: <TwinFieldProjections twinField={twinField} />,
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
                onClick={() => duplicateDialogRef.current?.open(twinField)}
                className="cursor-pointer"
              >
                <Copy className="mr-2 h-5 w-5" />
                Duplicate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <TwinClassFieldDuplicateDialog ref={duplicateDialogRef} />
    </>
  );
}
