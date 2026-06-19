"use client";

import { AsteriskIcon, EllipsisVertical, FolderUp } from "lucide-react";
import { useRef } from "react";

import { FactoryMultiplier_DETAILED } from "@/entities/factory-multiplier";
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
  FactoryMultiplierExportSqlDialog,
  FactoryMultiplierExportSqlDialogRef,
} from "@/widgets/tables";

import { FactoryMultiplierResourceTooltip } from "./tooltip";

type Props = {
  data: FactoryMultiplier_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function FactoryMultiplierResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const title =
    isPopulatedString(data.description) &&
    isPopulatedString(data.inputTwinClass?.name)
      ? `${data.inputTwinClass.name} | ${data.description}`
      : isPopulatedString(data.description)
        ? `N/A | ${data.description}`
        : "N/A";
  const link = `/${PlatformArea.core}/multipliers/${data.id}`;
  const exportSqlDialogRef = useRef<FactoryMultiplierExportSqlDialogRef>(null);
  const { canForRoute } = usePermissionsAccess();
  const canCreate = canForRoute(link, "CREATE");

  return (
    <>
      <ResourceLink
        IconComponent={AsteriskIcon}
        data={data}
        link={link}
        disabled={disabled}
        getDisplayName={() => title}
        renderTooltip={
          withTooltip
            ? (data) => (
                <FactoryMultiplierResourceTooltip
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

      <FactoryMultiplierExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
