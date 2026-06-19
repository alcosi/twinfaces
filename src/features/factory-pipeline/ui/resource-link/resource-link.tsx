"use client";

import { EllipsisVertical, FolderUp } from "lucide-react";
import { useRef } from "react";

import { FactoryPipeline } from "@/entities/factory-pipeline";
import { PlatformArea } from "@/shared/config";
import {
  isPopulatedString,
  shortenUUID,
  usePermissionsAccess,
} from "@/shared/libs";
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
  FactoryPipelineExportSqlDialog,
  FactoryPipelineExportSqlDialogRef,
} from "@/widgets/tables";

import { FactoryPipelineIcon } from "../factory-pipeline-icon";
import { FactoryPipelineResourceTooltip } from "./tooltip";

type Props = {
  data: FactoryPipeline;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function FactoryPipelineResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const title = isPopulatedString(data.id) ? shortenUUID(data.id) : "N/A";
  const link = `/${PlatformArea.core}/pipelines/${data.id}`;
  const exportSqlDialogRef = useRef<FactoryPipelineExportSqlDialogRef>(null);
  const { canForRoute } = usePermissionsAccess();
  const canCreate = canForRoute(link, "CREATE");

  return (
    <>
      <ResourceLink
        IconComponent={FactoryPipelineIcon}
        data={data}
        link={link}
        disabled={disabled}
        getDisplayName={() => title}
        renderTooltip={
          withTooltip
            ? (data) => (
                <FactoryPipelineResourceTooltip
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

      <FactoryPipelineExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
