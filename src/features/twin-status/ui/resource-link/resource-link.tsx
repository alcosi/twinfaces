"use client";

import { Square } from "lucide-react";

import { TwinStatusV2 } from "@/entities/twin-status";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { TwinStatusIcon } from "../twin-status-icon";
import { TwinClassStatusResourceTooltip } from "./tooltip";

type Props = {
  data: TwinStatusV2;
  twinClassId: string;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinClassStatusResourceLink({
  data,
  twinClassId,
  disabled,
  withTooltip,
}: Props) {
  // TODO: #Variant2 extract link into prop
  const link = `/${PlatformArea.core}/twinclass/${twinClassId}/twinStatus/${data.id}`;

  const Icon = data.backgroundColor ? (
    <Square
      className="h-4 w-4"
      fill={data.backgroundColor}
      stroke={data.backgroundColor}
    />
  ) : (
    <TwinStatusIcon className="h-4 w-4" />
  );

  return (
    <ResourceLink
      IconComponent={() => Icon}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => (
              <TwinClassStatusResourceTooltip
                data={data}
                link={link}
                IconComponent={TwinStatusIcon}
              />
            )
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : "N/A"
      }
      link={link}
    />
  );
}
