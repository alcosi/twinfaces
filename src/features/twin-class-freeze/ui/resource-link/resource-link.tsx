import { SnowflakeIcon } from "lucide-react";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { TwinClassFreezeResourceTooltip } from "./tooltip";

type Props = {
  data: TwinClass_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinClassFreezeResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const link = `/${PlatformArea.core}/twinclassfreeze/${data.id}`;

  return (
    <ResourceLink
      IconComponent={SnowflakeIcon}
      data={data}
      link={link}
      disabled={disabled}
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : "N/A"
      }
      renderTooltip={
        withTooltip
          ? (data) => <TwinClassFreezeResourceTooltip data={data} link={link} />
          : undefined
      }
    />
  );
}
