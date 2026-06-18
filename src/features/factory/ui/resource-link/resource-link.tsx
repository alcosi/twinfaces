"use client";

import {
  EllipsisVertical,
  Factory as FactoryIcon,
  FolderUp,
} from "lucide-react";
import { useRef } from "react";

import { Factory } from "@/entities/factory";
// eslint-disable-next-line fsd-import/layer-imports
import {
  FactoryExportSqlDialog,
  FactoryExportSqlDialogRef,
} from "@/screens/factories";
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

import { FactoryResourceTooltip } from "./tooltip";

type Props = {
  data: Factory;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function FactoryResourceLink({ data, disabled, withTooltip }: Props) {
  const exportSqlDialogRef = useRef<FactoryExportSqlDialogRef>(null);

  let title: string = "N/A";
  if (isPopulatedString(data.name)) title = data.name;
  else if (isPopulatedString(data.key)) title = data.key;

  const link = `/${PlatformArea.core}/factories/${data.id}`;
  const { canForRoute } = usePermissionsAccess();
  const canCreate = canForRoute(link, "CREATE");

  return (
    <>
      <ResourceLink
        IconComponent={() => <FactoryIcon className="h-4 w-4" />}
        data={data}
        link={link}
        disabled={disabled}
        getDisplayName={() => title}
        renderTooltip={
          withTooltip
            ? (data) => (
                <FactoryResourceTooltip
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

      <FactoryExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
