import { Tier } from "@/entities/tier";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { TierIcon } from "../tier-icon";
import { TierResourceTooltip } from "./tooltip";

type Props = {
  data: Tier;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TierResourceLink({ data, disabled, withTooltip }: Props) {
  const link = `/${PlatformArea.core}/tiers/${data.id}`;

  return (
    <ResourceLink
      IconComponent={TierIcon}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <TierResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : "N/A"
      }
      link={link}
    />
  );
}
