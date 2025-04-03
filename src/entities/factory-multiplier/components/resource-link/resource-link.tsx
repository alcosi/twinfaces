import { AsteriskIcon } from "lucide-react";

import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { FactoryMultiplier_DETAILED } from "../../api";
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

  return (
    <ResourceLink
      IconComponent={AsteriskIcon}
      data={data}
      link={link}
      disabled={disabled}
      getDisplayName={() => title}
      renderTooltip={
        withTooltip
          ? (data) => (
              <FactoryMultiplierResourceTooltip data={data} link={link} />
            )
          : undefined
      }
    />
  );
}
