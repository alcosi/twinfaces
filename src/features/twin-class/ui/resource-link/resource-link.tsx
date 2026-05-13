"use client";

import { Copy, EllipsisVertical, FolderUp } from "lucide-react";
import { useTheme } from "next-themes";
import { useRef } from "react";

import { TwinClass_DETAILED } from "@/entities/twin-class";
// eslint-disable-next-line fsd-import/layer-imports
import {
  TwinClassDuplicateDialog,
  TwinClassDuplicateDialogRef,
} from "@/screens/twin-classes/twin-class-duplicate-dialog";
// eslint-disable-next-line fsd-import/layer-imports
import {
  TwinClassExportSqlDialog,
  TwinClassExportSqlDialogRef,
} from "@/screens/twin-classes/twin-class-export-sql-dialog";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ResourceLink,
} from "@/shared/ui";

import { TwinClassIcon } from "../twin-class-icon";
import { TwinClassResourceTooltip } from "./tooltip";

type Props = {
  data: TwinClass_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinClassResourceLink({ data, disabled, withTooltip }: Props) {
  const link = `/${PlatformArea.core}/twinclass/${data.id}`;
  const { resolvedTheme } = useTheme();
  const duplicateDialogRef = useRef<TwinClassDuplicateDialogRef>(null);
  const exportSqlDialogRef = useRef<TwinClassExportSqlDialogRef>(null);

  const themeIcon =
    resolvedTheme === "light"
      ? data.iconLight
      : resolvedTheme === "dark"
        ? data.iconDark
        : null;

  return (
    <>
      <ResourceLink
        IconComponent={
          themeIcon ? () => <Avatar url={themeIcon} size="sm" /> : TwinClassIcon
        }
        data={data}
        disabled={disabled}
        renderTooltip={
          withTooltip
            ? (data) => (
                <TwinClassResourceTooltip
                  data={data}
                  link={link}
                  actions={
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          className="hover:bg-secondary h-6 w-7 shrink-0 p-0.5"
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
                  }
                />
              )
            : undefined
        }
        getDisplayName={(data) =>
          isPopulatedString(data.name) ? data.name : data.key
        }
        link={link}
      />

      <TwinClassDuplicateDialog ref={duplicateDialogRef} />
      <TwinClassExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
