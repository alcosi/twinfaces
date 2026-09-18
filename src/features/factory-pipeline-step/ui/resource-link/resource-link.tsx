"use client";

import { Copy, EllipsisVertical, FolderUp } from "lucide-react";
import { useRef } from "react";

import { PipelineStep_DETAILED } from "@/entities/factory-pipeline-step";
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
  FactoryPipelineStepDuplicateDialog,
  FactoryPipelineStepDuplicateDialogRef,
  FactoryPipelineStepExportSqlDialog,
  FactoryPipelineStepExportSqlDialogRef,
} from "@/widgets/tables";

import { FactoryPipelineStepIcon } from "../factory-pipeline-step-icon";
import { FactoryPipelineStepResourceTooltip } from "./tooltip";

type Props = {
  data: PipelineStep_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function FactoryPipelineStepResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const title = isPopulatedString(data.description) ? data.description : "N/A";
  const link = `/${PlatformArea.core}/pipeline-steps/${data.id}`;
  const duplicateDialogRef =
    useRef<FactoryPipelineStepDuplicateDialogRef>(null);
  const exportSqlDialogRef =
    useRef<FactoryPipelineStepExportSqlDialogRef>(null);
  const { canForRoute } = usePermissionsAccess();
  const canCreate = canForRoute(link, "CREATE");

  return (
    <>
      <ResourceLink
        IconComponent={FactoryPipelineStepIcon}
        data={data}
        link={link}
        disabled={disabled}
        getDisplayName={() => title}
        renderTooltip={
          withTooltip
            ? (data) => (
                <FactoryPipelineStepResourceTooltip
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

      <FactoryPipelineStepDuplicateDialog ref={duplicateDialogRef} />
      <FactoryPipelineStepExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
