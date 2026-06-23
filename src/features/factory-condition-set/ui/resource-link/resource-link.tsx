"use client";

import { Copy, EllipsisVertical } from "lucide-react";
import { useRef } from "react";

import { FactoryConditionSet } from "@/entities/factory-condition-set";
// eslint-disable-next-line fsd-import/layer-imports
import {
  FactoryConditionSetDuplicateDialog,
  FactoryConditionSetDuplicateDialogRef,
} from "@/screens/condition-sets";
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

import { FactoryConditionSetIcon } from "../factory-condition-set-icon";
import { FactoryConditionSetResourceTooltip } from "./tooltip";

type Props = {
  data: FactoryConditionSet;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function FactoryConditionSetResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const title = isPopulatedString(data.name) ? data.name : "N/A";
  const link = `/${PlatformArea.core}/condition-sets/${data.id}`;
  const duplicateDialogRef =
    useRef<FactoryConditionSetDuplicateDialogRef>(null);
  const { canForRoute } = usePermissionsAccess();
  const canCreate = canForRoute(link, "CREATE");

  return (
    <>
      <ResourceLink
        IconComponent={FactoryConditionSetIcon}
        data={data}
        link={link}
        disabled={disabled}
        getDisplayName={() => title}
        renderTooltip={
          withTooltip
            ? (data) => (
                <FactoryConditionSetResourceTooltip
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : undefined
                  }
                />
              )
            : undefined
        }
      />

      <FactoryConditionSetDuplicateDialog ref={duplicateDialogRef} />
    </>
  );
}
