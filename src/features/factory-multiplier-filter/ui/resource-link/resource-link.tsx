"use client";

import { Copy, EllipsisVertical, SquareAsterisk } from "lucide-react";
import { useRef } from "react";

import { FactoryMultiplierFilter_DETAILED } from "@/entities/factory-multiplier-filter";
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
  FactoryMultiplierFilterDuplicateDialog,
  FactoryMultiplierFilterDuplicateDialogRef,
} from "@/widgets/tables";

import { FactoryMultiplierFilterResourceTooltip } from "./tooltip";

type Props = {
  data: FactoryMultiplierFilter_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function FactoryMultiplierFilterResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const title = isPopulatedString(data.description) ? data.description : "N/A";
  const link = `/${PlatformArea.core}/multiplier-filters/${data.id}`;
  const duplicateDialogRef =
    useRef<FactoryMultiplierFilterDuplicateDialogRef>(null);
  const { canForRoute } = usePermissionsAccess();
  const canCreate = canForRoute(link, "CREATE");

  return (
    <>
      <ResourceLink
        IconComponent={SquareAsterisk}
        data={data}
        link={link}
        disabled={disabled}
        getDisplayName={() => title}
        renderTooltip={
          withTooltip
            ? (data) => (
                <FactoryMultiplierFilterResourceTooltip
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

      <FactoryMultiplierFilterDuplicateDialog ref={duplicateDialogRef} />
    </>
  );
}
