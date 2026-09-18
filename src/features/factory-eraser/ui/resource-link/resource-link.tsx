"use client";

import { Copy, EllipsisVertical, Eraser, FolderUp } from "lucide-react";
import { useRef } from "react";

import { FactoryEraser_DETAILED } from "@/entities/factory-eraser";
// eslint-disable-next-line fsd-import/layer-imports
import {
  FactoryEraserDuplicateDialog,
  FactoryEraserDuplicateDialogRef,
  FactoryEraserExportSqlDialog,
  FactoryEraserExportSqlDialogRef,
} from "@/screens/factory-erasers";
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

import { FactoryEraserResourceTooltip } from "./tooltip";

type Props = {
  data: FactoryEraser_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function FactoryEraserResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const title = isPopulatedString(data.description) ? data.description : "N/A";
  const link = `/${PlatformArea.core}/erasers/${data.id}`;
  const duplicateDialogRef = useRef<FactoryEraserDuplicateDialogRef>(null);
  const exportSqlDialogRef = useRef<FactoryEraserExportSqlDialogRef>(null);
  const { canForRoute } = usePermissionsAccess();
  const canCreate = canForRoute(link, "CREATE");

  return (
    <>
      <ResourceLink
        IconComponent={Eraser}
        data={data}
        link={link}
        disabled={disabled}
        getDisplayName={() => title}
        renderTooltip={
          withTooltip
            ? (data) => (
                <FactoryEraserResourceTooltip
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

      <FactoryEraserDuplicateDialog ref={duplicateDialogRef} />
      <FactoryEraserExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
