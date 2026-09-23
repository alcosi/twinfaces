"use client";

import { Activity } from "lucide-react";

import { TwinFlowFactory_DETAILED } from "@/entities/twinflow-factory";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString, shortenUUID } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { TwinFlowFactoryResourceTooltip } from "./tooltip";

type Props = {
  data: TwinFlowFactory_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

/**
 * No actions menu: a twinflow factory has neither a duplicate nor an export
 * endpoint, so there is nothing to put in one.
 */
export function TwinFlowFactoryResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  // The launcher is what distinguishes one of these from another — the entity
  // itself is just the link between a twinflow and a factory.
  const title = isPopulatedString(data.twinFactoryLauncherId)
    ? data.twinFactoryLauncherId
    : isPopulatedString(data.id)
      ? shortenUUID(data.id)
      : "N/A";
  const link = `/${PlatformArea.core}/twinflow-factories/${data.id}`;

  return (
    <ResourceLink
      IconComponent={Activity}
      data={data}
      link={link}
      disabled={disabled}
      getDisplayName={() => title}
      renderTooltip={
        withTooltip
          ? (data) => <TwinFlowFactoryResourceTooltip data={data} link={link} />
          : undefined
      }
    />
  );
}
