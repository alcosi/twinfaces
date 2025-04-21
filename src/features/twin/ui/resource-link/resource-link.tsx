"use client";

import { formatTwinDisplay } from "@/entities/twin";
import { Twin } from "@/entities/twin/server";
import { PlatformArea } from "@/shared/config";
import { ResourceLink } from "@/shared/ui";

import { TwinIcon } from "../twin-icon";
import { TwinResourceTooltip } from "./tooltip";

type Props = {
  data: Twin;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinResourceLink({ data, disabled, withTooltip }: Props) {
  const link = `/${PlatformArea.core}/twins/${data.id}`;

  return (
    <ResourceLink
      IconComponent={TwinIcon}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <TwinResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={formatTwinDisplay}
      link={link}
    />
  );
}
