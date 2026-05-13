"use client";

import { Copy, EllipsisVertical } from "lucide-react";
import { useRef } from "react";

import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
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
  TwinClassFieldDuplicateDialog,
  TwinClassFieldDuplicateDialogRef,
} from "@/widgets/tables/twin-class-fields/twin-class-field-duplicate-dialog";

import { FieldIcon } from "../field-icon";
import { TwinClassFieldResourceTooltip } from "./tooltip";

type Props = {
  data: TwinClassField_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinClassFieldResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const link = `/${PlatformArea.core}/fields/${data.id}`;
  const duplicateDialogRef = useRef<TwinClassFieldDuplicateDialogRef>(null);

  return (
    <>
      <ResourceLink
        IconComponent={FieldIcon}
        data={data}
        disabled={disabled}
        renderTooltip={
          withTooltip
            ? (data) => (
                <TwinClassFieldResourceTooltip
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

      <TwinClassFieldDuplicateDialog ref={duplicateDialogRef} />
    </>
  );
}
