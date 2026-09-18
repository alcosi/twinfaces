"use client";

import { Copy, EllipsisVertical, FolderUp, Zap } from "lucide-react";
import { useRef } from "react";

import { FactoryTrigger_DETAILED } from "@/entities/factory-trigger";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString, usePermissionsAccess } from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ResourceLink,
} from "@/shared/ui";
// eslint-disable-next-line fsd-import/layer-imports
import {
  FactoryTriggerDuplicateDialog,
  FactoryTriggerDuplicateDialogRef,
  FactoryTriggerExportSqlDialog,
  FactoryTriggerExportSqlDialogRef,
} from "@/widgets/tables";

import { FactoryTriggerResourceTooltip } from "./tooltip";

type Props = {
  data: FactoryTrigger_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function FactoryTriggerResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const title = isPopulatedString(data.description) ? data.description : "N/A";
  const link = `/${PlatformArea.core}/factory-triggers/${data.id}`;
  const duplicateDialogRef = useRef<FactoryTriggerDuplicateDialogRef>(null);
  const exportSqlDialogRef = useRef<FactoryTriggerExportSqlDialogRef>(null);
  const { canForRoute } = usePermissionsAccess();
  const canCreate = canForRoute(link, "CREATE");

  return (
    <>
      <ResourceLink
        IconComponent={Zap}
        data={data}
        link={link}
        disabled={disabled}
        getDisplayName={() => title}
        renderTooltip={
          withTooltip
            ? (data) => (
                <FactoryTriggerResourceTooltip
                  data={data}
                  link={link}
                  actions={
                    canCreate ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            className="hover:bg-secondary h-7 w-7 shrink-0 p-0.5"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <EllipsisVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" portalled={false}>
                          <DropdownMenuItem
                            onClick={(event) => {
                              event.stopPropagation();
                              duplicateDialogRef.current?.open(data);
                            }}
                            className="cursor-pointer"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(event) => {
                              event.stopPropagation();
                              exportSqlDialogRef.current?.open(data);
                            }}
                            className="cursor-pointer"
                          >
                            <FolderUp className="mr-2 h-4 w-4" />
                            Export sql
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : undefined
                  }
                />
              )
            : undefined
        }
      />

      <FactoryTriggerDuplicateDialog ref={duplicateDialogRef} />
      <FactoryTriggerExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
