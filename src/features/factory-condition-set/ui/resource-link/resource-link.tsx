import { FactoryConditionSet } from "@/entities/factory-condition-set";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

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

  return (
    <ResourceLink
      IconComponent={FactoryConditionSetIcon}
      data={data}
      link={link}
      disabled={disabled}
      getDisplayName={() => title}
      renderTooltip={
        withTooltip
          ? (data) => (
              <FactoryConditionSetResourceTooltip data={data} link={link} />
            )
          : undefined
      }
    />
  );
}
