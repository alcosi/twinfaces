"use client";

import { Copy, EllipsisVertical, FolderUp } from "lucide-react";
import { useRef } from "react";

import { FactoryBranch_DETAILED } from "@/entities/factory-branch";
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
  FactoryBranchDuplicateDialog,
  FactoryBranchDuplicateDialogRef,
  FactoryBranchExportSqlDialog,
  FactoryBranchExportSqlDialogRef,
} from "@/widgets/tables";

import { FactoryBranchIcon } from "../factory-branch-icon";
import { FactoryBranchResourceTooltip } from "./tooltip";

type Props = {
  data: FactoryBranch_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function FactoryBranchResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const title = isPopulatedString(data.description) ? data.description : "N/A";
  const link = `/${PlatformArea.core}/branches/${data.id}`;
  const duplicateDialogRef = useRef<FactoryBranchDuplicateDialogRef>(null);
  const exportSqlDialogRef = useRef<FactoryBranchExportSqlDialogRef>(null);
  const { canForRoute } = usePermissionsAccess();
  const canCreate = canForRoute(link, "CREATE");

  return (
    <>
      <ResourceLink
        IconComponent={FactoryBranchIcon}
        data={data}
        link={link}
        disabled={disabled}
        getDisplayName={() => title}
        renderTooltip={
          withTooltip
            ? (data) => (
                <FactoryBranchResourceTooltip
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

      <FactoryBranchDuplicateDialog ref={duplicateDialogRef} />
      <FactoryBranchExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
